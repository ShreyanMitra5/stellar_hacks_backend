import string

user_input = input('Enter some text: ')

mental_awareness_health_phrases = ['I am so angry!', 'Holy shit', 'I hate my life', 'kys', 'kill myself']
mental_awareness_health_words = ['angry', 'mad', 'kill', 'suicide', 'die']


def remove_punctuation(text):
    translator = str.maketrans('', '', string.punctuation)
    return text.translate(translator)

clean_string = remove_punctuation(user_input)


def analyze_text(user_input):
    sampling = user_input.split()
    print(sampling)
    count = 0
    for word in sampling:
        if word in mental_awareness_health_words:
            count += 1
    for phrase in mental_awareness_health_phrases:
        if phrase in user_input:
            count += len(sampling)

    final = count/(len(sampling))
    print(f'You are {final*100}% mentally disturbed')

analyze_text(clean_string)