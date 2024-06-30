from typing import List, Dict
from datetime import datetime, timedelta
import random

class TrendingAnalysis:
    def __init__(self, id: int, title: str, slug: str, views: int, date: datetime):
        self.id = id
        self.title = title
        self.slug = slug
        self.views = views
        self.date = date

# Simulated database of trending analyses
trending_analyses = [
    TrendingAnalysis(1, "Top 5 Tech Stocks for 2024", "top-5-tech-stocks-2024", 1000, datetime.now() - timedelta(days=1)),
    TrendingAnalysis(2, "Market Outlook: Q3 Earnings Preview", "q3-earnings-preview", 850, datetime.now() - timedelta(days=2)),
    TrendingAnalysis(3, "Emerging Trends in Renewable Energy", "renewable-energy-trends", 750, datetime.now() - timedelta(days=3)),
    TrendingAnalysis(4, "Cryptocurrency Market Analysis", "crypto-market-analysis", 900, datetime.now() - timedelta(days=1)),
    TrendingAnalysis(5, "AI in Finance: Transforming the Industry", "ai-in-finance", 800, datetime.now() - timedelta(days=2)),
]

def get_trending_analyses(limit: int = 5) -> List[Dict]:
    # Sort analyses by views and date, then return the top 'limit' items
    sorted_analyses = sorted(trending_analyses, key=lambda x: (x.views, x.date), reverse=True)
    return [
        {
            "id": analysis.id,
            "title": analysis.title,
            "slug": analysis.slug,
            "views": analysis.views,
            "date": analysis.date.isoformat()
        }
        for analysis in sorted_analyses[:limit]
    ]

def update_trending_analyses():
    # Simulate real-time updates by randomly modifying view counts
    for analysis in trending_analyses:
        analysis.views += random.randint(-50, 100)
        if analysis.views < 0:
            analysis.views = 0