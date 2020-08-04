#encoding

input = "aaaaabbac"
count = 1
prev = ''
lst = []
for character in input:
    if character != prev:
        if prev:
            entry = (prev,count)
            lst.append(entry)
            #print lst
        count = 1
        prev = character
    else:
        count += 1

else:
    try:
        entry = (character,count)
        lst.append(entry)
        #return (lst, 0)
    except Exception as e:
        print("Exception encountered {e}".format(e=e))

print(lst)

#decoding

q = ""
for character, count in lst:
    q += character * count
    #return q
print(q)