from flask_jwt_extended import create_access_token

def generate_token(user):
    print(f"Generating token for user: {user.name}")  # Debugging line
    return create_access_token(identity={"id": user.id, "name": user.name, "role": user.role})