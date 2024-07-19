"""Update Stock model asset_type

Revision ID: 8fa8ff88b25c
Revises: 78632e10bc67
Create Date: 2024-07-19 15:23:39.165774

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8fa8ff88b25c'
down_revision: Union[str, None] = '78632e10bc67'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Update existing NULL values to a default value
    op.execute("UPDATE stocks SET asset_type = 'stock' WHERE asset_type IS NULL")
    
    # Now alter the column to be NOT NULL
    op.alter_column('stocks', 'asset_type',
               existing_type=sa.VARCHAR(),
               nullable=False,
               server_default=sa.text("'stock'"))  # Set a default value for future inserts


def downgrade() -> None:
    op.alter_column('stocks', 'asset_type',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.execute("ALTER TABLE stocks ALTER COLUMN asset_type DROP DEFAULT")