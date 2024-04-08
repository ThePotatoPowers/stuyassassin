
import csv
import random


names_file = open('names.txt', 'r')
names = names_file.read().split('\n')

names_file.close()


choice = input("""Welcome! Here are your options:\n

- new: Generate a new list of pairs
- update: Update the list after a kill
- reset: Reset the list
- view: View the current list
- exit: Exit the program\n

""")

if choice == 'new':
    print('Generating new list...')
    targets = []
    pairs = []

    for name in names:
        target = random.choice(names)
        # make sure the target is not the same as the name and that the target is not already in the list
        # also make sure the target and the name are not EACH OTHER's targets

        while target == name or target in targets or (name in targets and target == pairs[targets.index(name)]['target']):
            target = random.choice(names)



        targets.append(target)


        pair = {'name': name, 'target': target}
        pairs.append(pair)

    with open('pairs.csv', 'w', newline='') as csvfile:
        fieldnames = ['name', 'target']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for pair in pairs:
            writer.writerow(pair)

    print('Pairs generated and saved to pairs.csv')   

elif choice == 'update':
    killer = input("Got it! Who got a kill? (name):\n")
    with open('pairs.csv', 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        pairs = []
        for row in reader:
            pairs.append(row)
        
        for pair in pairs:
            if pair['name'] == killer:
                target = pair['target']
                break
        
        for pair in pairs:
            if pair['name'] == target:
                new_target = pair['target']
                break
        
        for pair in pairs:
            if pair['name'] == killer:
                pair['target'] = new_target
            if pair['name'] == target:
                # remove the pair from the list
                pairs.remove(pair)
        
        with open('pairs.csv', 'w', newline='') as csvfile:
            fieldnames = ['name', 'target']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            for pair in pairs:
                writer.writerow(pair)
            
        print(f'{killer} has killed {target}! New target for {killer} is {new_target}')

elif choice == 'exit':
    print('Goodbye!')
    exit()

elif choice == 'reset':
    with open('pairs.csv', 'w', newline='') as csvfile:
        fieldnames = ['name', 'target']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()

    print('Pairs list has been reset!')

elif choice == 'view':
    with open('pairs.csv', 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            print(row)
