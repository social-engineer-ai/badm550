from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from .database import SessionLocal
from .models.core import User, UserRole
from .services.email_service import email_service
import logging
import asyncio
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def daily_sync_job():
    """Trigger AI sync for all teachers found in the system."""
    db = SessionLocal()
    try:
        teachers = db.query(User).filter(User.role == UserRole.TEACHER).all()
        for teacher in teachers:
            logger.info(f"Triggering automated 8:00 AM sync for: {teacher.email}")
            # We use an async wrapper or call the service directly if compatible
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(email_service.sync_and_process_inbox(db=db, user_id=teacher.id))
            loop.close()
    except Exception as e:
        logger.error(f"Error in daily_sync_job: {e}")
    finally:
        db.close()

def taco_tuesday_job():
    """Trigger the bi-weekly 10:00 AM pulse invitation blast."""
    db = SessionLocal()
    try:
        # Get the primary instructor (first teacher found)
        instructor = db.query(User).filter(User.role == UserRole.TEACHER).first()
        if instructor:
            logger.info("🌮 Starting Taco Tuesday Pulse Blast...")
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(email_service.send_bulk_pulse_invitation(db=db, instructor_id=instructor.id))
            loop.close()
    except Exception as e:
        logger.error(f"Error in taco_tuesday_job: {e}")
    finally:
        db.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    
    # Run daily sync at 8:00 AM
    scheduler.add_job(
        daily_sync_job,
        CronTrigger(hour=8, minute=0),
        id="daily_ai_sync",
        name="Automated daily AI triage",
        replace_existing=True,
    )

    # Run Taco Tuesday pulse at 10:00 AM (Tuesday)
    scheduler.add_job(
        taco_tuesday_job,
        CronTrigger(day_of_week='tue', hour=10, minute=0),
        id="taco_tuesday_pulse",
        name="Bi-weekly Student Pulse Blast",
        replace_existing=True,
    )
    
    scheduler.start()
    logger.info("Background Scheduler Started: Daily Sync at 08:00 AM & Taco Tuesday at 10:00 AM")
    return scheduler
