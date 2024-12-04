fn main() {
    let grid = read_input();
    // println!("{:?}", grid);
    println!("{:?}", count_xmas(grid.as_slice()));
    
}

fn read_input() -> Vec<Vec<char>> {
    return std::io::stdin().lines().map(|l| l.unwrap().chars().collect()).collect();
}

fn count_xmas(letter_grid: &[Vec<char>]) -> u32 {
    let mut sum = 0;
    for i in 0..letter_grid.len() {
        for j in 0..letter_grid[0].len() {
            if letter_grid[i][j] == 'X' {
                sum += find_xmas(letter_grid, (i.try_into().unwrap(), j.try_into().unwrap()))
            }
        }
    }
    return sum;
}

fn find_xmas(letter_grid: &[Vec<char>], location: (u32, u32)) -> u32 {
    let mut xmas_count = 0;
    for i in -1i32..=1 {
        for j in -1i32..=1 {
            if i == 0 && j == 0 {
                continue;
            }
            xmas_count += check_xmas_in_dir(letter_grid, &location, (i, j));
        }
    }

    return xmas_count;
}

fn check_xmas_in_dir(letter_grid: &[Vec<char>], location: &(u32, u32), dir: (i32, i32)) -> u32 {
    let (row, column) = location;
    let (v_dir, h_dir) = dir;

    let search = ['X', 'M', 'A', 'S'];

    for i in 0i32..search.len() as i32 {
        if *row as i32 + (i * v_dir) >= letter_grid.len().try_into().unwrap() || *row as i32 + (i * v_dir) < 0 || *column as i32 + (i * h_dir) >= letter_grid[0].len().try_into().unwrap() || *column as i32 + (i * h_dir) < 0 {
            return 0;
        }
        if letter_grid[(*row as i32 + (i*v_dir)) as usize][(*column as i32 + (i*h_dir)) as usize] != search[i as usize] {
            return 0;
        }
    }
    return 1;
}

// if i == 0 && j == 0 {
//     continue;
// }
// fn check