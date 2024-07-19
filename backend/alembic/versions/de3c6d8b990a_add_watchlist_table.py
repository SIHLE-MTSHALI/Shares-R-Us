"""Add watchlist table

Revision ID: de3c6d8b990a
Revises: 8fa8ff88b25c
Create Date: 2024-07-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'de3c6d8b990a'
down_revision = '8fa8ff88b25c'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('watchlist',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('symbol', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_watchlist_id'), 'watchlist', ['id'], unique=False)
    op.create_index(op.f('ix_watchlist_symbol'), 'watchlist', ['symbol'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_watchlist_symbol'), table_name='watchlist')
    op.drop_index(op.f('ix_watchlist_id'), table_name='watchlist')
    op.drop_table('watchlist')