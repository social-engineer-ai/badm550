"""
Seed script for AWG Pricing Analysis project.
Run with: python seed_projects.py
"""
from app.database import SessionLocal
# Import all models to ensure relationships are registered
from app.models.core import Semester, Team, User
from app.models.features import Week
from app.models.projects import ProjectModule, ProjectMilestone, ProjectResource, ResourceType, ProjectStatus


def seed_awg_project():
    db = SessionLocal()

    # Check if project already exists
    existing = db.query(ProjectModule).filter(ProjectModule.name == "AWG Pricing Analysis").first()
    if existing:
        print("AWG project already exists. Skipping...")
        db.close()
        return

    # Create AWG Project
    project = ProjectModule(
        name="AWG Pricing Analysis",
        description="""Analysis of AWG private label brands pricing and sales data to answer 6 research questions about price gaps, cost pass-through, elasticity, cross-brand effects, geographic variation, and tariff impact.

Your team will work with real transaction data from Associated Wholesale Grocers (AWG), the nation's largest cooperative food wholesaler. Using Python and data science techniques, you'll analyze pricing strategies, consumer behavior, and market dynamics across their private label portfolio.""",
        client_name="Associated Wholesale Grocers",
        status=ProjectStatus.ACTIVE
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Add project-level resources
    resources = [
        {
            "title": "AWG Company Overview",
            "resource_type": ResourceType.DOCUMENT,
            "url": "https://docs.google.com/document/d/awg-overview",
            "description": "Background on AWG and the private label industry",
            "display_order": 1
        },
        {
            "title": "Data Dictionary",
            "resource_type": ResourceType.DOCUMENT,
            "url": "https://docs.google.com/spreadsheets/d/data-dictionary",
            "description": "Column definitions and data types for all datasets",
            "display_order": 2
        },
        {
            "title": "Master Dataset (Google Drive)",
            "resource_type": ResourceType.DATASET,
            "url": "https://drive.google.com/drive/folders/awg-data",
            "description": "Access to raw and cleaned datasets",
            "display_order": 3
        }
    ]

    for r in resources:
        db_resource = ProjectResource(project_id=project.id, **r)
        db.add(db_resource)

    # Add milestones (15 weeks)
    milestones = [
        {
            "week_number": 1,
            "title": "Course Introduction & Platform Onboarding",
            "theme": "Getting Started",
            "description": """Welcome to BADM 550! This week we'll get set up with all the tools and meet your team.

Key activities:
- Complete platform registration and profile setup
- Join your assigned team channel on Slack
- Review the course syllabus and grading rubric
- Complete the Python proficiency self-assessment""",
            "deliverables": [],
            "resources": [
                {"title": "Course Overview Video", "type": "video_youtube", "url": "https://youtube.com/watch?v=intro", "description": "20 min overview"},
                {"title": "Platform Setup Guide", "type": "document", "url": "https://docs.google.com/setup", "description": None}
            ],
            "guidance_notes": "Take time to explore the platform. Reach out if you have any technical issues."
        },
        {
            "week_number": 2,
            "title": "Client Introduction & Project Kickoff",
            "theme": "Meet AWG",
            "description": """Meet our client, Associated Wholesale Grocers, and understand the business problem.

This week you'll learn about:
- AWG's business model and market position
- The private label vs. national brand dynamic
- The 6 research questions we'll answer this semester
- How your team's data slice was assigned""",
            "deliverables": [
                {"name": "Team Charter", "description": "Document team roles, communication plan, and working agreements (1-2 pages)", "submission_type": "link", "points": 10}
            ],
            "resources": [
                {"title": "AWG Client Presentation", "type": "video_youtube", "url": "https://youtube.com/watch?v=awg-intro", "description": "Client kickoff recording"},
                {"title": "Research Questions Deep Dive", "type": "document", "url": "https://docs.google.com/research-qs", "description": None}
            ],
            "guidance_notes": "The team charter is foundational - spend time discussing expectations and communication norms."
        },
        {
            "week_number": 3,
            "title": "Data Exploration & Quality Assessment",
            "theme": "Understanding the Data",
            "description": """Begin exploring your team's data slice. This week focuses on understanding the structure, quality, and patterns in your assigned dataset.

Key tasks:
- Load and examine the data in Python/Colab
- Document data quality issues (missing values, outliers, etc.)
- Create initial summary statistics
- Identify key variables for analysis""",
            "deliverables": [
                {"name": "Data Quality Report", "description": "Jupyter notebook documenting data exploration, quality issues, and initial insights", "submission_type": "notebook", "points": 20}
            ],
            "resources": [
                {"title": "Data Exploration Template", "type": "notebook_colab", "url": "https://colab.research.google.com/drive/data-exploration", "description": "Starter notebook"},
                {"title": "Pandas Profiling Tutorial", "type": "video_youtube", "url": "https://youtube.com/watch?v=pandas-prof", "description": "10 min tutorial"}
            ],
            "guidance_notes": "Don't rush to analysis - thorough data understanding prevents costly mistakes later."
        },
        {
            "week_number": 4,
            "title": "Price Gap Calculation",
            "theme": "Research Question 1",
            "description": """Calculate and analyze the price gap between AWG private labels and comparable national brands.

Focus areas:
- Define 'comparable' products methodically
- Calculate price gaps at multiple aggregation levels
- Visualize price gap distributions
- Identify patterns by category, region, or time""",
            "deliverables": [
                {"name": "Price Gap Analysis", "description": "Analysis notebook with price gap calculations, visualizations, and preliminary findings", "submission_type": "notebook", "points": 25}
            ],
            "resources": [
                {"title": "Price Gap Methodology", "type": "document", "url": "https://docs.google.com/price-gap-method", "description": None},
                {"title": "Visualization Best Practices", "type": "video_youtube", "url": "https://youtube.com/watch?v=viz-tips", "description": "Data viz fundamentals"}
            ],
            "guidance_notes": "Document your matching methodology clearly - AWG will want to understand your approach."
        },
        {
            "week_number": 5,
            "title": "Cost Pass-Through Analysis",
            "theme": "Research Question 2",
            "description": """Analyze how cost changes pass through to retail prices for private labels vs. national brands.

You'll examine:
- The relationship between wholesale costs and retail prices
- Differences in pass-through rates by brand type
- Time lags in price adjustments
- Category-level variations""",
            "deliverables": [
                {"name": "Pass-Through Analysis", "description": "Regression analysis of cost-to-price relationships with visualizations", "submission_type": "notebook", "points": 25}
            ],
            "resources": [
                {"title": "Pass-Through Economics Primer", "type": "document", "url": "https://docs.google.com/passthrough-primer", "description": None},
                {"title": "Regression in Python", "type": "notebook_colab", "url": "https://colab.research.google.com/drive/regression-tutorial", "description": "statsmodels tutorial"}
            ],
            "guidance_notes": "Consider using panel data methods if your data supports it."
        },
        {
            "week_number": 6,
            "title": "Price Elasticity Estimation",
            "theme": "Research Question 3",
            "description": """Estimate demand elasticities for private label products and compare to national brands.

Key analyses:
- Own-price elasticity estimation
- Comparison across product categories
- Sensitivity analysis of methodology choices
- Interpretation of business implications""",
            "deliverables": [
                {"name": "Elasticity Analysis", "description": "Econometric analysis of demand elasticities with methodology documentation", "submission_type": "notebook", "points": 30}
            ],
            "resources": [
                {"title": "Demand Estimation Methods", "type": "video_youtube", "url": "https://youtube.com/watch?v=demand-estimation", "description": "Econometrics lecture"},
                {"title": "Elasticity Calculation Guide", "type": "notebook_colab", "url": "https://colab.research.google.com/drive/elasticity", "description": None}
            ],
            "guidance_notes": "Elasticity estimation requires careful attention to endogeneity - discuss your identification strategy."
        },
        {
            "week_number": 7,
            "title": "Mid-Project Check-In",
            "theme": "Progress Review",
            "description": """Team presentations on progress and preliminary findings. This is a chance to get feedback and course-correct.

Prepare to discuss:
- Key findings so far
- Methodological challenges and how you addressed them
- Questions for the client
- Planned approach for remaining research questions""",
            "deliverables": [
                {"name": "Progress Presentation", "description": "5-minute team presentation on findings and challenges (slides + recording)", "submission_type": "link", "points": 20}
            ],
            "resources": [
                {"title": "Presentation Template", "type": "document", "url": "https://docs.google.com/presentation-template", "description": None}
            ],
            "guidance_notes": "Be honest about challenges - the client and instructors can help you problem-solve."
        },
        {
            "week_number": 8,
            "title": "Cross-Brand Effects",
            "theme": "Research Question 4",
            "description": """Analyze how private label pricing affects national brand sales and vice versa.

Explore:
- Cross-price elasticities
- Substitution patterns
- Strategic pricing implications
- Category-level dynamics""",
            "deliverables": [
                {"name": "Cross-Brand Analysis", "description": "Analysis of cross-price effects and substitution patterns", "submission_type": "notebook", "points": 25}
            ],
            "resources": [
                {"title": "Cross-Price Elasticity Tutorial", "type": "video_youtube", "url": "https://youtube.com/watch?v=cross-price", "description": None}
            ],
            "guidance_notes": "Consider market structure when interpreting cross-price effects."
        },
        {
            "week_number": 9,
            "title": "Geographic Variation",
            "theme": "Research Question 5",
            "description": """Examine how pricing strategies and consumer responses vary across AWG's geographic footprint.

Analyze:
- Regional price differences
- Demand variation by geography
- Competitive landscape effects
- Demographic correlations""",
            "deliverables": [
                {"name": "Geographic Analysis", "description": "Spatial analysis of pricing and demand patterns with maps/visualizations", "submission_type": "notebook", "points": 25}
            ],
            "resources": [
                {"title": "GeoPandas Mapping Tutorial", "type": "notebook_colab", "url": "https://colab.research.google.com/drive/geopandas", "description": None},
                {"title": "AWG Market Regions", "type": "document", "url": "https://docs.google.com/awg-regions", "description": None}
            ],
            "guidance_notes": "Don't just describe differences - try to explain them with available data."
        },
        {
            "week_number": 10,
            "title": "Tariff Impact Analysis",
            "theme": "Research Question 6",
            "description": """Analyze how recent tariffs have affected AWG's private label products, particularly those with imported inputs.

Consider:
- Identifying tariff-affected products
- Before/after comparison
- Difference-in-differences if applicable
- Consumer response to tariff-driven price changes""",
            "deliverables": [
                {"name": "Tariff Analysis", "description": "Causal analysis of tariff impacts on pricing and demand", "submission_type": "notebook", "points": 30}
            ],
            "resources": [
                {"title": "Tariff Timeline & Products", "type": "document", "url": "https://docs.google.com/tariff-timeline", "description": None},
                {"title": "Diff-in-Diff Tutorial", "type": "video_youtube", "url": "https://youtube.com/watch?v=did-tutorial", "description": None}
            ],
            "guidance_notes": "This is a chance to apply causal inference methods - be rigorous about assumptions."
        },
        {
            "week_number": 11,
            "title": "Integration & Synthesis",
            "theme": "Connecting the Dots",
            "description": """Begin integrating your findings across all research questions into a coherent narrative.

Focus on:
- How findings connect and reinforce each other
- Contradictions or tensions to address
- Story arc for the final presentation
- Key recommendations taking shape""",
            "deliverables": [
                {"name": "Integration Memo", "description": "2-3 page memo synthesizing key findings and emerging recommendations", "submission_type": "link", "points": 20}
            ],
            "resources": [
                {"title": "Business Writing Guide", "type": "document", "url": "https://docs.google.com/writing-guide", "description": None}
            ],
            "guidance_notes": "Write for the business audience - lead with insights, not methodology."
        },
        {
            "week_number": 12,
            "title": "Draft Presentation Development",
            "theme": "Telling the Story",
            "description": """Develop the first complete draft of your final presentation.

Include:
- Executive summary
- Methodology overview
- Key findings per research question
- Integrated recommendations
- Appendix with technical details""",
            "deliverables": [
                {"name": "Draft Presentation", "description": "Complete draft of final presentation slides", "submission_type": "link", "points": 15}
            ],
            "resources": [
                {"title": "Presentation Best Practices", "type": "video_youtube", "url": "https://youtube.com/watch?v=pres-tips", "description": None},
                {"title": "Final Presentation Template", "type": "document", "url": "https://docs.google.com/final-template", "description": None}
            ],
            "guidance_notes": "Aim for a 20-minute presentation - practice pacing."
        },
        {
            "week_number": 13,
            "title": "Peer Review & Refinement",
            "theme": "Feedback Loop",
            "description": """Exchange presentations with another team for peer feedback. Use feedback to refine your work.

Peer review focuses on:
- Clarity and flow
- Strength of analysis
- Actionability of recommendations
- Presentation quality""",
            "deliverables": [
                {"name": "Peer Review", "description": "Written feedback on partner team's presentation (structured template)", "submission_type": "link", "points": 10}
            ],
            "resources": [
                {"title": "Peer Review Template", "type": "document", "url": "https://docs.google.com/peer-review-template", "description": None}
            ],
            "guidance_notes": "Give the feedback you'd want to receive - specific and constructive."
        },
        {
            "week_number": 14,
            "title": "Final Presentation to Client",
            "theme": "The Big Day",
            "description": """Present your findings and recommendations to AWG stakeholders.

Presentation day logistics:
- 20-minute presentation per team
- 10-minute Q&A with client
- All team members should speak
- Business professional attire recommended""",
            "deliverables": [
                {"name": "Final Presentation", "description": "Final presentation slides and recording", "submission_type": "link", "points": 50},
                {"name": "Technical Appendix", "description": "Complete code repository with documentation", "submission_type": "link", "points": 20}
            ],
            "resources": [],
            "guidance_notes": "Rehearse multiple times. Anticipate client questions."
        },
        {
            "week_number": 15,
            "title": "Reflection & Course Wrap-Up",
            "theme": "Looking Back & Ahead",
            "description": """Reflect on your learning journey and complete course evaluations.

Final activities:
- Individual reflection on team dynamics and personal growth
- Course evaluation
- Optional: LinkedIn recommendations for teammates
- Celebrate your accomplishments!""",
            "deliverables": [
                {"name": "Individual Reflection", "description": "Personal reflection on learning and team experience (1-2 pages)", "submission_type": "link", "points": 10}
            ],
            "resources": [
                {"title": "Reflection Prompts", "type": "document", "url": "https://docs.google.com/reflection-prompts", "description": None}
            ],
            "guidance_notes": "Be honest in your reflection - this is for your growth, not a grade."
        }
    ]

    for m in milestones:
        # Convert deliverables and resources if they exist
        deliverables = m.pop('deliverables', [])
        resources = m.pop('resources', [])

        milestone = ProjectMilestone(
            project_id=project.id,
            deliverables=deliverables,
            resources=resources,
            **m
        )
        db.add(milestone)

    db.commit()
    db.close()
    print("AWG project seeded successfully with 15 milestones!")


if __name__ == "__main__":
    seed_awg_project()
