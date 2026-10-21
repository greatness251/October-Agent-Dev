def greet_students(name) :
    print(f"Hello, {name}! Welcome to Python Class.")

greet_students("Greatness")
greet_students("John")

def introduce(name, age, city, job):
    print(f'Hello, my name is {name}. I am {age} years old, I live in {city}, and I work as a {job}.')     
introduce("Greatness", 20, "Abuja", "Software Engineer")


def greet(name='Greatness'):
    print(f"Hello, {name}! Welcome to the program.")
greet()
greet('Greatness')