"""Add description to portfolios table

Revision ID: 55c3a32a1600
Revises: c302da12a124
Create Date: 2024-06-30 20:56:33.610752

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '55c3a32a1600'
down_revision: Union[str, None] = 'c302da12a124'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('portfolios', sa.Column('description', sa.String(), nullable=True))

def downgrade():
    op.drop_column('portfolios', 'description')
