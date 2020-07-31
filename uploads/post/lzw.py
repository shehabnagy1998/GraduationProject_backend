def encode(input):
    dictionary_size = 256
    dictionary = dict((chr(i), chr(i)) for i in range(dictionary_size))

    s = ""

    result = []
    for c in input:
        sc = s + c
        if sc in dictionary:
            s = sc
        else:
            result.append(dictionary[s])
            dictionary[sc] = dictionary_size
            dictionary_size += 1
            s = c
    if s:
        result.append(dictionary[s])

    return result

def decode(input):
    dictionary_size = 256
    dictionary = dict((chr(i), chr(i)) for i in range(dictionary_size))


    result = []
    s = compressed.pop(0)
    result += s
    for k in compressed:
        if k in dictionary:
            entry = dictionary[k]
            print(entry)
        elif k == dictionary_size:
            entry = s + s[0]
        else:
            print("Bad key")
        result += entry

        dictionary[dictionary_size] = s + entry[0]
        dictionary_size = dictionary_size + 1

        s = entry
    return result




myinput = "aaaaabbbccd"
compressed = encode(myinput)
print(compressed)
decompress = decode(compressed)
print(decompress)