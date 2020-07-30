#encoding
etable = []
counter = 0
histogram = [0,50,120,200]
for x in histogram:
    if x not in etable:
        etable.insert(counter,x)
        counter = counter+1

i = 0
while i < counter:
    print(i," ",etable[i])
    i=i+1

input = [0,0,50,120,120,120,200,0]
encoded = []
for x in input:
    if x in etable:
        encoded.append(etable.index(x))
    else:
        print("not found in encoding table")

print(encoded)

#decoding
decoded = []
for x in encoded:
    decoded.append(etable[x])

print(decoded)