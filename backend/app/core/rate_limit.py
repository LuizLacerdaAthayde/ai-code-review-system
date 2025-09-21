from datetime import datetime, timedelta
from collections import defaultdict

LIMIT_PER_HOUR = 10
WINDOW = timedelta(hours=1)
_requests = defaultdict(list)

def allow(ip: str) -> bool:
    now = datetime.utcnow()
    start = now - WINDOW
    hist = _requests[ip]
    while hist and hist[0] < start:
        hist.pop(0)
    if len(hist) >= LIMIT_PER_HOUR:
        return False
    hist.append(now)
    return True
