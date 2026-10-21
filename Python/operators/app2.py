# Assignment Operators
"""
Assignment operators are used to assign values to variables. 
In Python, the most common assignment operator is the equal sign (=).
However, there are several other assignment operators that combine assignment with arithmetic or bitwise operations.
"""

a = 10  # Assigning the value 10 to variable a
print(a)

b = 5

b += 3  # Equivalent to b = b + 3
print(b)

c = 15
c -= 5  # Equivalent to c = c - 5
print(c)

d = 4
d *= 2  # Equivalent to d = d * 2
print(d)

e = 20
e /= 4  # Equivalent to e = e / 4
print(e)

f = 10
f %= 3  # Equivalent to f = f % 3
print(f)

g = 2
g **= 3  # Equivalent to g = g ** 3
print(g)

h = 10
h //= 3  # Equivalent to h = h // 3
print(h)

i = 5
i &= 3  # Equivalent to i = i & 3 (bitwise AND)
print(i)

j = 5
j |= 3  # Equivalent to j = j | 3 (bitwise OR)
print(j)

k = 5
k ^= 3  # Equivalent to k = k ^ 3 (bitwise XOR)
print(k)

l = 5
l <<= 1  # Equivalent to l = l << 1 (left shift)
print(l)

m = 5
m >>= 1  # Equivalent to m = m >> 1 (right shift)
print(m)