use std::collections::HashMap;

fn main() {
    let mut input = read_input();
    let distance = calculate_distance(input.0.as_mut_slice(), input.1.as_mut_slice());
    println!("Distance: {:?}", distance);
    let similarity = calculate_similarity(input.0.as_slice(), input.1.as_slice());
    println!("Similarity: {:?}", similarity);
}

fn read_input() -> (Vec<i32>, Vec<i32>) {
    let mut l_list: Vec<i32> = Vec::new();
    let mut r_list: Vec<i32> = Vec::new();

    let lines = std::io::stdin().lines();
    for line in lines {
        let line_val = line.unwrap();
        let mut parts = line_val.split_whitespace();
        l_list.push(parts.next().expect("Error with iterator").parse::<i32>().expect("Can't parse string"));
        r_list.push(parts.next().expect("Error accessing iterator").parse::<i32>().expect("Can't parse string"));
    }

    return (l_list, r_list);
}

fn calculate_distance(left: &mut [i32], right: &mut [i32]) -> i32 {
    left.sort();
    right.sort();

    let mut distance = 0;
    for i in 0..left.len() {
        distance += left[i].abs_diff(right[i]);
    }

    return distance.try_into().unwrap();
}

fn calculate_similarity(left: &[i32], right: &[i32]) -> i32 {
    let freqs = right.iter().fold(HashMap::new(), |mut hash, cur| {
        hash.entry(cur).and_modify(|entry| *entry += 1).or_insert(1);
        return hash;
    });

    let similarity = left.iter().fold(0, |acc, cur| {
        return acc + cur * freqs.get(cur).unwrap_or(&0);
    });

    return similarity;
}