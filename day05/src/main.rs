use std::collections::HashMap;
use std::collections::HashSet;
use std::cmp::Ordering;

fn main() {
    let (rules, updates) = read_input();
    println!("{:?}", part1(updates.as_slice(), &rules));
    println!("{:?}", part2(updates.as_slice(), &rules));
}

fn read_input() -> (HashMap<u32,HashSet<u32>>, Vec<Vec<u32>>) {
    let lines = std::io::stdin().lines();

    let mut rules: HashMap<u32,HashSet<u32>> = HashMap::new();
    let mut iter = lines.into_iter();
    loop {
        match iter.next() {
            None => break,
            Some(line) => {
                let line_val = line.unwrap();
                if line_val == "" {
                    break;
                }
                
                let mut split = line_val.split('|');
                let rule = split.next().unwrap().parse::<u32>().unwrap();
                let restriction = split.next().unwrap().parse::<u32>().unwrap();
                if rules.contains_key(&rule) {
                    rules.get_mut(&rule).unwrap().insert(restriction);
                } else {
                    let mut set = HashSet::new();
                    set.insert(restriction);
                    rules.insert(rule, set);
                }
            }
        }
    }

    let updates = iter.map(|line| {line.unwrap().split(',').map(str::parse::<u32>).map(Result::unwrap).collect()}).collect();

    return (rules, updates);
}

fn part1(updates: &[Vec<u32>], rules: &HashMap<u32,HashSet<u32>>) -> u32 {
    updates.iter().filter(|update| is_print_safe(&update, &rules)).fold(0, |acc, update| acc + update.get(update.len() / 2).unwrap())
}

fn part2(updates: &[Vec<u32>], rules: &HashMap<u32,HashSet<u32>>) -> u32 {
    let custom_sort = |a: &u32, b: &u32| -> Ordering {
        let restrictions = rules.get(a).unwrap();
        if restrictions.contains(b) {
            return Ordering::Less;
        } else if a == b {
            return Ordering::Equal;
        } else {
            return Ordering::Greater;
        }
    };

    return updates.iter()
        .filter(|update| !is_print_safe(update, rules))
        .fold(0, |acc, update| {
            let mut update_clone = update.clone();
            update_clone.sort_by(custom_sort);
            acc + update_clone.get(update.len() / 2).unwrap()
        });
}

fn is_print_safe(update: &[u32], rules: &HashMap<u32,HashSet<u32>>) -> bool {
    let mut printed_pages = HashSet::new();
    for page in update {
        let restrictions = rules.get(page).unwrap();
        if restrictions.iter().map(|restriction| printed_pages.contains(restriction)).any(|val| val) {
            return false;
        }
        printed_pages.insert(page);
    }

    return true;
}