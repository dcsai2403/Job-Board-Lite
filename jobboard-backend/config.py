import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "super-secret-key"
    SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Configuration (Required)
    JWT_SECRET_KEY = "your_jwt_secret"  # You can use os.environ.get() here for prod
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_ACCESS_TOKEN_EXPIRES = False  # or timedelta(seconds=3600) for expiry
