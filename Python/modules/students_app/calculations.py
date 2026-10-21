def add(a: int, b: int)  -> int:
    return a + b

def calculate_average(scores: list[int]) -> float:
    if not scores:
        return 0.0

    return sum(scores) /len(scores)
