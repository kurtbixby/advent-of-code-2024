fn main() {
    let input = read_input();
    // println!("{:?}", input);
    let safe_reports = input.iter().filter(|report| calculate_report_safety(report)).count();
    println!("Safe reports: {:?}", safe_reports);
    let safe_reports_iter = input.iter().filter(|report| calculate_report_safety_iter(report.iter())).count();
    println!("Safe reports (iter): {:?}", safe_reports_iter);
    let safe_dampened_reports = input.iter().filter(|report| calculate_with_damper(report)).count();
    println!("Safe reports (damper): {:?}", safe_dampened_reports);
}

fn read_input() -> Vec<Vec<i32>> {
    let mut reports = Vec::new();

    let lines = std::io::stdin().lines();
    for line in lines {
        let mut report = Vec::new();
        let line_val = line.unwrap();
        let parts = line_val.split_whitespace();
        for num in parts {
            report.push(num.parse::<i32>().expect("Can't parse string"));
        }
        reports.push(report);
    }

    return reports;
}

fn calculate_report_safety(report: &[i32]) -> bool {
    let monotonic_sign = sign(report[1] - report[0]);

    for i in 0..report.len() - 1 {
        let diff = report[i+1].abs_diff(report[i]);
        if diff < 1 || diff > 3 || sign(report[i+1] - report[i]) != monotonic_sign {
            return false;
        }
    }

    return true;
}

fn calculate_report_safety_iter<'a, T>(mut report_iter: T) -> bool
where T: Iterator<Item = &'a i32> {
    let mut prev = report_iter.next().unwrap();
    let cur = report_iter.next().unwrap();
    let monotonic_sign = sign(cur - prev);
    let diff = cur.abs_diff(*prev);
    if diff < 1 || diff > 3 {
        return false;
    }
    prev = cur;

    for cur in report_iter {
        let diff = cur.abs_diff(*prev);
        if diff < 1 || diff > 3 || sign(cur - prev) != monotonic_sign {
            return false;
        }
        prev = cur;
    }

    return true;
}

fn calculate_with_damper(report: &[i32]) -> bool {
    let mut prefix = Vec::new();
    for i in 0..report.len() {
        let spliced_iter = prefix.iter().chain(report.iter().skip(i+1));

        if calculate_report_safety_iter(spliced_iter) {
            return true;
        }
        prefix.push(report[i]);
    }
    return false;
}

fn sign(number: i32) -> i32 {
    return if number < 0 { -1 } else if number > 0 { 1 } else { 0 };
}