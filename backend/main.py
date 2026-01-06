from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

try:
    # When running as a module (e.g., docker, uvicorn backend.main:app)
    from .app.scheduler import start_scheduler
    from .app.routers import auth, instructor, students, admin, projects, testing
except ImportError:
    # When running directly or in tests
    from app.scheduler import start_scheduler
    from app.routers import auth, instructor, students, admin, projects, testing

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start background scheduler
    scheduler = start_scheduler()
    yield
    # Shutdown scheduler
    scheduler.shutdown()

app = FastAPI(title="BADM 550 API", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(instructor.router, prefix="/api/v1")
app.include_router(students.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(testing.router, prefix="/api/v1", tags=["testing"])

@app.get("/")
async def root():
    return {"message": "Welcome to the BADM 550 Course OS API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
