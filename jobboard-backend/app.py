from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from config import Config
from models import db, User, JobPost, Application
from auth_utils import generate_token
import os

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:5173"}})

jwt = JWTManager(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.before_request
def handle_options_requests():
    if request.method == 'OPTIONS':
        return '', 200

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400

    if not name:
        return jsonify({"msg": "Name is required"}), 400  # Ensure name is provided

    user = User(name=name, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Registration successful"}), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        print(f"User found: {user.name}")  # Debugging line
        token = generate_token(user)
        return jsonify({"token": token, "role": user.role})

    return jsonify({"msg": "Invalid email or password"}), 401

@app.route("/api/jobs", methods=["GET"])
def get_all_jobs():
    jobs = JobPost.query.all()
    return jsonify([{
        "id": job.id,
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "date_posted": job.date_posted.isoformat()
    } for job in jobs])

@app.route("/api/recruiter/jobs", methods=["POST"])
@jwt_required()
def recruiter_jobs_post():
    current_user = get_jwt_identity()
    print("Decoded JWT payload:", current_user)  # Debugging line

    user = User.query.get(current_user["id"])

    # Convert role to lowercase for comparison
    if not user or user.role.lower() != "recruiter":
        return jsonify({"msg": "Only recruiters can access this route"}), 403

    data = request.get_json()
    print("Incoming payload:", data)  # Debugging line

    title = data.get("title")
    description = data.get("description")
    location = data.get("location", "")

    if not title or not description:
        return jsonify({"msg": "Title and description are required"}), 400

    job = JobPost(
        employer_id=user.id,
        title=title,
        description=description,
        location=location
    )
    db.session.add(job)
    db.session.commit()
    return jsonify({"msg": "Job posted successfully"}), 201

@app.route("/api/recruiter/jobs", methods=["GET"])
@jwt_required()
def get_recruiter_jobs():
    current_user = get_jwt_identity()
    user = User.query.get(current_user["id"])

    if not user or user.role.lower() != "recruiter":
        return jsonify({"msg": "Only recruiters can access this route"}), 403

    jobs = JobPost.query.filter_by(employer_id=user.id).all()
    return jsonify([{
        "id": job.id,
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "date_posted": job.date_posted.isoformat()
    } for job in jobs])
    
@app.route("/api/jobs/<int:job_id>", methods=["GET"])
def get_job(job_id):
    job = JobPost.query.get_or_404(job_id)
    return jsonify({
        "id": job.id,
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "date_posted": job.date_posted.isoformat()
    })

@app.route("/api/jobs/<int:job_id>/apply", methods=["POST"])
@jwt_required()
def apply_to_job(job_id):
    current_user = get_jwt_identity()
    user = User.query.get(current_user["id"])
    if not user or user.role.lower() != "seeker":
        return jsonify({"msg": "Only job seekers can apply"}), 403

    # Handle form data
    email = request.form.get("email")
    phone = request.form.get("phone")
    cover_letter = request.form.get("cover_letter")

    # Handle file upload as a stream
    if 'resume' not in request.files:
        return jsonify({"msg": "Resume file is required"}), 400

    file = request.files['resume']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Save the file in chunks
        with open(file_path, 'wb') as f:
            while chunk := file.stream.read(4096):  # Read in 4KB chunks
                f.write(chunk)
    else:
        return jsonify({"msg": "Invalid file type. Only PDF, DOC, and DOCX are allowed"}), 400

    # Save application to the database
    application = Application(
        user_id=user.id,
        job_post_id=job_id,
        cover_letter=cover_letter
    )
    db.session.add(application)
    db.session.commit()

    return jsonify({"msg": "Application submitted"}), 201

@app.route("/api/applications", methods=["GET"])
@jwt_required()
def view_my_applications():
    current_user = get_jwt_identity()
    user = User.query.get(current_user["id"])
    if not user or user.role.lower() != "seeker":
        return jsonify({"msg": "Only job seekers can view applications"}), 403

    applications = Application.query.filter_by(user_id=user.id).all()
    return jsonify([{
        "job_id": app.job_post_id,
        "job_title": JobPost.query.get(app.job_post_id).title,
        "date_applied": app.date_applied.isoformat()
    } for app in applications])

@app.route("/api/seeker/jobs", methods=["GET"])
@jwt_required()
def get_jobs_for_seeker():
    current_user = get_jwt_identity()
    user = User.query.get(current_user["id"])

    if not user or user.role.lower() != "seeker":
        return jsonify({"msg": "Only job seekers can access this route"}), 403

    jobs = JobPost.query.all()
    return jsonify([{
        "id": job.id,
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "date_posted": job.date_posted.isoformat()
    } for job in jobs])

@app.route("/api/applications/<int:job_id>", methods=["GET"])
@jwt_required()
def view_applications_for_job(job_id):
    current_user = get_jwt_identity()
    user = User.query.get(current_user["id"])

    job = JobPost.query.get_or_404(job_id)
    if job.employer_id != user.id:
        return jsonify({"msg": "Unauthorized"}), 403

    apps = Application.query.filter_by(job_post_id=job_id).all()
    return jsonify([{
        "applicant": User.query.get(app.user_id).name,
        "cover_letter": app.cover_letter,
        "date_applied": app.date_applied.isoformat()
    } for app in apps])

@app.route("/api/recruiter/jobs/<int:job_id>/applicants", methods=["GET"])
@jwt_required()
def get_applicants_for_job(job_id):
    current_user = get_jwt_identity()
    user = User.query.get(current_user["id"])

    # Ensure the user is a recruiter
    if not user or user.role.lower() != "recruiter":
        return jsonify({"msg": "Only recruiters can access this route"}), 403

    # Ensure the job belongs to the recruiter
    job = JobPost.query.get_or_404(job_id)
    if job.employer_id != user.id:
        return jsonify({"msg": "Unauthorized"}), 403

    # Fetch applicants for the job
    applications = Application.query.filter_by(job_post_id=job_id).all()
    applicants = [{
        "id": app.user_id,
        "name": User.query.get(app.user_id).name,
        "email": User.query.get(app.user_id).email,
        "dob": "Not available"  # Add DOB if it's part of the User model
    } for app in applications]

    return jsonify(applicants)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)