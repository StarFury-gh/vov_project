from enum import Enum

class RequestStatus(Enum):
    PENDING = "new"
    APPROVED = "approved"
    REJECTED = "rejected"