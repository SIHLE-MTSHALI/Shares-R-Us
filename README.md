# Shares'R'Us

## Description

Shares'R'Us is a comprehensive stock portfolio management application designed to empower investors with tools for tracking, analyzing, and managing their stock investments. This full-stack application combines a robust backend API built with FastAPI and a responsive frontend developed using React, providing users with a seamless and intuitive experience for managing their investment portfolios.

## Key Features

- **User Authentication**: Secure registration and login system.
- **Portfolio Management**: Create, view, update, and delete investment portfolios.
- **Asset Tracking**: Add and monitor stocks and cryptocurrencies within portfolios.
- **Market Overview**: Real-time updates on major market indices.
- **News Feed**: Latest financial news to keep users informed.
- **Trending Analysis**: Insights into popular market trends and analyses.
- **Data Visualization**: Interactive charts for portfolio performance.
- **Watchlist**: Track potential investment opportunities.

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React.js
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **State Management**: Redux
- **Styling**: Tailwind CSS
- **API Integration**: Alpha Vantage, CoinAPI, NewsAPI

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 14+
- PostgreSQL

### Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/shares-r-us.git
    cd shares-r-us
    ```

2. **Set up the backend:**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows use venv\Scripts\activate
    pip install -r requirements.txt
    ```

3. **Set up the database:**
    - Create a PostgreSQL database
    - Update the `DATABASE_URL` in `.env` file

4. **Run database migrations:**
    ```bash
    alembic upgrade head
    ```

5. **Set up the frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

6. **Create a `.env` file in the root directory and add necessary environment variables:**
    ```ini
    DATABASE_URL=postgresql://user:password@localhost/sharesrus
    SECRET_KEY=your_secret_key
    ALPHA_VANTAGE_API_KEY=your_api_key
    COINAPI_API_KEY=your_api_key
    NEWS_API_KEY=your_api_key
    ```

### Running the Application

1. **Start the backend server:**
    ```bash
    cd backend
    uvicorn app.main:app --reload
    ```

2. **Start the frontend development server:**
    ```bash
    cd frontend
    npm start
    ```

3. **Access the application at** `http://localhost:3000`

## Usage

1. Register for an account or log in if you already have one.
2. Create a new portfolio from the dashboard.
3. Add stocks or cryptocurrencies to your portfolio.
4. View real-time market data and news on the dashboard.
5. Analyze your portfolio performance using the interactive charts.
6. Stay updated with trending market analyses.

## Future Outlook

Shares'R'Us has a promising roadmap for future enhancements:

1. **Advanced Analytics**: Implement more sophisticated portfolio analysis tools, including risk assessment and diversification metrics.
2. **Mobile App**: Develop a mobile application for iOS and Android platforms.
3. **Social Features**: Introduce community features allowing users to share insights and strategies.
4. **AI-Powered Recommendations**: Integrate machine learning algorithms for personalized investment recommendations.
5. **Extended Asset Classes**: Include support for bonds, ETFs, and other financial instruments.
6. **Real-Time Notifications**: Implement push notifications for significant market events or portfolio changes.
7. **Integration with Brokers**: Allow direct trading through integration with popular brokerage APIs.
8. **Enhanced Security**: Implement two-factor authentication and advanced encryption methods.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Alpha Vantage for providing stock market data
- CoinAPI for cryptocurrency information
- NewsAPI for financial news updates