use regex::Regex;

fn main() {
    let input = read_input();
    let all_muls_sum: u32 = input.iter().map(|line| all_muls(line)).sum();
    println!("All mul() sum: {:?}", all_muls_sum);
    let enabled_muls_sum: u32 = input.iter().scan(true, |state, line| enabled_muls(line, state)).sum();
    println!("Enabled mul() sum: {:?}", enabled_muls_sum);
}

fn read_input() -> Vec<String> {
    let mut ins_rows = Vec::new();

    let lines = std::io::stdin().lines();
    for line in lines {
        ins_rows.push(line.unwrap());
    }

    return ins_rows;
}

fn all_muls(line: &str) -> u32 {
    let re = Regex::new(r"mul\((\d+),(\d+)\)").unwrap();
    return re.captures_iter(line).map(|capture| {
        let (_, [o1, o2]) = capture.extract();
        o1.parse::<u32>().unwrap() * o2.parse::<u32>().unwrap()
    }).sum();
}

fn enabled_muls(line: &str, enabled: &mut bool) -> Option<u32> {
    let re = Regex::new(r"do\(\)|don't\(\)|mul\((\d+),(\d+)\)").unwrap();
    return Some(re.captures_iter(line).map(|capture| {
        match capture.get(0).unwrap().as_str() {
            "do()" => {*enabled = true; 0},
            "don't()" => {*enabled = false; 0},
            _ => {
                if *enabled {
                    capture.get(1).unwrap().as_str().parse::<u32>().unwrap() * capture.get(2).unwrap().as_str().parse::<u32>().unwrap()
                } else {
                    0
                }
            }
        }
    }).sum());
}