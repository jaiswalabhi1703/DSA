/* Mock Interview Question Bank
   6 Easy-Medium  (Problem 1 pool)
   6 Medium-Hard  (Problem 2 pool)
   Each problem: statement, examples, constraints, test cases, starter code
*/

const MOCK_BANK = {

  easyMedium: [

    /* ────────────────── 1. Two Sum ────────────────── */
    {
      id: 'two-sum',
      title: 'Two Sum',
      difficulty: 'Easy → Medium',
      diffClass: 'em',
      tags: ['Array', 'Hash Table'],
      expectedTC: 'O(n)',
      expectedSC: 'O(n)',
      lcUrl: 'https://leetcode.com/problems/two-sum/',
      statement: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return the <strong>indices</strong> of the two numbers such that they add up to <code>target</code>.</p>
<p>You may assume each input has <strong>exactly one solution</strong>. You may not use the same element twice. Return the answer in any order.</p>`,
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
        { input: 'nums = [3,3], target = 6', output: '[0,1]', explanation: 'nums[0] + nums[1] = 3 + 3 = 6' }
      ],
      constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹', 'Only one valid answer exists.'],
      testCases: [
        { input: '4\n2 7 11 15\n9',  expected: '0 1', label: 'nums=[2,7,11,15], target=9' },
        { input: '3\n3 2 4\n6',       expected: '1 2', label: 'nums=[3,2,4], target=6' },
        { input: '2\n3 3\n6',         expected: '0 1', label: 'nums=[3,3], target=6' },
        { input: '5\n1 4 8 3 5\n9',   expected: '1 3', label: 'nums=[1,4,8,3,5], target=9' }
      ],
      starterCode: {
        python: `import sys

def twoSum(nums: list, target: int) -> list:
    # ✏️  Write your solution here
    pass

# ─── I/O boilerplate – do not modify ────────────────
def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    nums = [int(data[i+1]) for i in range(n)]
    target = int(data[n+1])
    result = twoSum(nums, target)
    print(result[0], result[1])

main()`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here
    public static int[] twoSum(int[] nums, int target) {
        return new int[]{};
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        int[] r = twoSum(nums, target);
        System.out.println(r[0] + " " + r[1]);
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here
vector<int> twoSum(vector<int>& nums, int target) {
    return {};
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int& x : nums) cin >> x;
    int target; cin >> target;
    vector<int> r = twoSum(nums, target);
    cout << r[0] << " " << r[1] << "\\n";
    return 0;
}`
      }
    },

    /* ────────────────── 2. Valid Parentheses ────────────────── */
    {
      id: 'valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy → Medium',
      diffClass: 'em',
      tags: ['String', 'Stack'],
      expectedTC: 'O(n)',
      expectedSC: 'O(n)',
      lcUrl: 'https://leetcode.com/problems/valid-parentheses/',
      statement: `<p>Given a string <code>s</code> containing only the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is <strong>valid</strong>.</p>
<p>A string is valid if:</p>
<ul>
  <li>Every open bracket has a matching close bracket of the same type.</li>
  <li>Open brackets are closed in the correct order.</li>
  <li>Every close bracket has a corresponding open bracket.</li>
</ul>`,
      examples: [
        { input: 's = "()"', output: 'true', explanation: 'Single matching pair.' },
        { input: 's = "()[]{}"', output: 'true', explanation: 'All three types, each matched.' },
        { input: 's = "(]"', output: 'false', explanation: 'Types do not match.' }
      ],
      constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only.'],
      testCases: [
        { input: '()',      expected: 'true',  label: 's="()"' },
        { input: '()[]{}', expected: 'true',  label: 's="()[]{}"' },
        { input: '(]',     expected: 'false', label: 's="(]"' },
        { input: '([)]',   expected: 'false', label: 's="([)]"' },
        { input: '{[]}',   expected: 'true',  label: 's="{[]}"' }
      ],
      starterCode: {
        python: `import sys

def isValid(s: str) -> bool:
    # ✏️  Write your solution here
    pass

# ─── I/O boilerplate – do not modify ────────────────
s = sys.stdin.read().strip()
print("true" if isValid(s) else "false")`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here
    public static boolean isValid(String s) {
        return false;
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(isValid(s) ? "true" : "false");
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here
bool isValid(string s) {
    return false;
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    string s; cin >> s;
    cout << (isValid(s) ? "true" : "false") << "\\n";
    return 0;
}`
      }
    },

    /* ────────────────── 3. Maximum Subarray ────────────────── */
    {
      id: 'maximum-subarray',
      title: 'Maximum Subarray',
      difficulty: 'Easy → Medium',
      diffClass: 'em',
      tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
      expectedTC: 'O(n)',
      expectedSC: 'O(1)',
      lcUrl: 'https://leetcode.com/problems/maximum-subarray/',
      statement: `<p>Given an integer array <code>nums</code>, find the <strong>subarray</strong> with the largest sum, and return <em>its sum</em>.</p>
<p>A subarray is a contiguous non-empty part of the array.</p>`,
      examples: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum = 6.' },
        { input: 'nums = [1]', output: '1', explanation: 'Single element.' },
        { input: 'nums = [5,4,-1,7,8]', output: '23', explanation: 'Entire array is optimal.' }
      ],
      constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
      testCases: [
        { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expected: '6',  label: '[-2,1,-3,4,-1,2,1,-5,4]' },
        { input: '1\n1',                       expected: '1',  label: '[1]' },
        { input: '5\n5 4 -1 7 8',              expected: '23', label: '[5,4,-1,7,8]' },
        { input: '4\n-3 -1 -2 -4',             expected: '-1', label: 'all negatives' }
      ],
      starterCode: {
        python: `import sys

def maxSubArray(nums: list) -> int:
    # ✏️  Write your solution here (Kadane's Algorithm)
    pass

# ─── I/O boilerplate – do not modify ────────────────
data = sys.stdin.read().split()
n = int(data[0])
nums = [int(data[i+1]) for i in range(n)]
print(maxSubArray(nums))`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here (Kadane's Algorithm)
    public static int maxSubArray(int[] nums) {
        return 0;
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        System.out.println(maxSubArray(nums));
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here (Kadane's Algorithm)
int maxSubArray(vector<int>& nums) {
    return 0;
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int& x : nums) cin >> x;
    cout << maxSubArray(nums) << "\\n";
    return 0;
}`
      }
    },

    /* ────────────────── 4. Climbing Stairs ────────────────── */
    {
      id: 'climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy → Medium',
      diffClass: 'em',
      tags: ['Math', 'Dynamic Programming', 'Memoization'],
      expectedTC: 'O(n)',
      expectedSC: 'O(1)',
      lcUrl: 'https://leetcode.com/problems/climbing-stairs/',
      statement: `<p>You are climbing a staircase with <code>n</code> steps to reach the top. Each time you can either climb <strong>1</strong> or <strong>2</strong> steps. In how many distinct ways can you climb to the top?</p>`,
      examples: [
        { input: 'n = 2', output: '2', explanation: 'Two ways: {1,1} or {2}.' },
        { input: 'n = 3', output: '3', explanation: 'Three ways: {1,1,1}, {1,2}, {2,1}.' },
        { input: 'n = 5', output: '8', explanation: 'Eight ways.' }
      ],
      constraints: ['1 ≤ n ≤ 45'],
      testCases: [
        { input: '2',  expected: '2',  label: 'n=2' },
        { input: '3',  expected: '3',  label: 'n=3' },
        { input: '5',  expected: '8',  label: 'n=5' },
        { input: '10', expected: '89', label: 'n=10' }
      ],
      starterCode: {
        python: `import sys

def climbStairs(n: int) -> int:
    # ✏️  Write your solution here
    # Hint: It's the Fibonacci sequence!
    pass

# ─── I/O boilerplate – do not modify ────────────────
n = int(sys.stdin.read().strip())
print(climbStairs(n))`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here
    // Hint: It's the Fibonacci sequence!
    public static int climbStairs(int n) {
        return 0;
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(climbStairs(n));
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here
// Hint: It's the Fibonacci sequence!
int climbStairs(int n) {
    return 0;
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    int n; cin >> n;
    cout << climbStairs(n) << "\\n";
    return 0;
}`
      }
    },

    /* ────────────────── 5. Best Time to Buy and Sell Stock ────────────────── */
    {
      id: 'best-time-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy → Medium',
      diffClass: 'em',
      tags: ['Array', 'Dynamic Programming'],
      expectedTC: 'O(n)',
      expectedSC: 'O(1)',
      lcUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
      statement: `<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i</code>-th day.</p>
<p>You want to maximize your profit by choosing a <strong>single day to buy</strong> one stock and choosing a <strong>different day in the future to sell</strong> that stock. Return the <em>maximum profit</em> you can achieve. If no profit is possible, return <code>0</code>.</p>`,
      examples: [
        { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6). Profit = 6-1 = 5.' },
        { input: 'prices = [7,6,4,3,1]',   output: '0', explanation: 'Prices only decline. No transaction is profitable.' }
      ],
      constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'],
      testCases: [
        { input: '6\n7 1 5 3 6 4', expected: '5', label: '[7,1,5,3,6,4]' },
        { input: '5\n7 6 4 3 1',   expected: '0', label: '[7,6,4,3,1]' },
        { input: '1\n5',           expected: '0', label: 'single element' },
        { input: '4\n1 2 4 1',     expected: '3', label: '[1,2,4,1]' }
      ],
      starterCode: {
        python: `import sys

def maxProfit(prices: list) -> int:
    # ✏️  Write your solution here
    # Track the minimum price seen so far
    pass

# ─── I/O boilerplate – do not modify ────────────────
data = sys.stdin.read().split()
n = int(data[0])
prices = [int(data[i+1]) for i in range(n)]
print(maxProfit(prices))`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here
    // Track the minimum price seen so far
    public static int maxProfit(int[] prices) {
        return 0;
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();
        System.out.println(maxProfit(prices));
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here
// Track the minimum price seen so far
int maxProfit(vector<int>& prices) {
    return 0;
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    int n; cin >> n;
    vector<int> prices(n);
    for (int& x : prices) cin >> x;
    cout << maxProfit(prices) << "\\n";
    return 0;
}`
      }
    },

    /* ────────────────── 6. Merge Intervals ────────────────── */
    {
      id: 'merge-intervals',
      title: 'Merge Intervals',
      difficulty: 'Easy → Medium',
      diffClass: 'em',
      tags: ['Array', 'Sorting'],
      expectedTC: 'O(n log n)',
      expectedSC: 'O(n)',
      lcUrl: 'https://leetcode.com/problems/merge-intervals/',
      statement: `<p>Given an array of <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, merge all overlapping intervals, and return <em>an array of the non-overlapping intervals that cover all the intervals in the input</em>.</p>`,
      examples: [
        { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] and [2,6] overlap → merge to [1,6].' },
        { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Touching intervals are merged.' }
      ],
      constraints: ['1 ≤ intervals.length ≤ 10⁴', 'intervals[i].length == 2', '0 ≤ start ≤ end ≤ 10⁴'],
      testCases: [
        { input: '4\n1 3\n2 6\n8 10\n15 18', expected: '1 6\n8 10\n15 18', label: '[[1,3],[2,6],[8,10],[15,18]]' },
        { input: '2\n1 4\n4 5',              expected: '1 5',               label: '[[1,4],[4,5]]' },
        { input: '1\n1 10',                  expected: '1 10',              label: 'single interval' },
        { input: '3\n1 4\n2 3\n3 5',         expected: '1 5',               label: '[[1,4],[2,3],[3,5]]' }
      ],
      starterCode: {
        python: `import sys

def merge(intervals: list) -> list:
    # ✏️  Write your solution here
    # Hint: Sort by start time first
    pass

# ─── I/O boilerplate – do not modify ────────────────
def main():
    data = sys.stdin.read().strip().split('\\n')
    n = int(data[0])
    intervals = [list(map(int, data[i+1].split())) for i in range(n)]
    result = merge(intervals)
    for a, b in result:
        print(a, b)

main()`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here
    // Hint: Sort by start time first
    public static int[][] merge(int[][] intervals) {
        return new int[][]{};
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] intervals = new int[n][2];
        for (int i = 0; i < n; i++) {
            intervals[i][0] = sc.nextInt();
            intervals[i][1] = sc.nextInt();
        }
        int[][] result = merge(intervals);
        for (int[] r : result)
            System.out.println(r[0] + " " + r[1]);
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here
// Hint: Sort by start time first
vector<pair<int,int>> merge(vector<pair<int,int>>& intervals) {
    return {};
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    int n; cin >> n;
    vector<pair<int,int>> intervals(n);
    for (auto& [a,b] : intervals) cin >> a >> b;
    auto result = merge(intervals);
    for (auto [a,b] : result)
        cout << a << " " << b << "\\n";
    return 0;
}`
      }
    }

  ], // end easyMedium

  mediumHard: [

    /* ────────────────── 1. Coin Change ────────────────── */
    {
      id: 'coin-change',
      title: 'Coin Change',
      difficulty: 'Medium → Hard',
      diffClass: 'mh',
      tags: ['Array', 'Dynamic Programming', 'BFS'],
      expectedTC: 'O(amount × n)',
      expectedSC: 'O(amount)',
      lcUrl: 'https://leetcode.com/problems/coin-change/',
      statement: `<p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p>
<p>Return the <strong>fewest number of coins</strong> needed to make up that amount. If that amount cannot be made up by any combination of the coins, return <code>-1</code>.</p>
<p>You may assume that you have an <strong>infinite number</strong> of each kind of coin.</p>`,
      examples: [
        { input: 'coins = [1,5,11], amount = 11', output: '1', explanation: 'Use the 11-coin directly.' },
        { input: 'coins = [1,2,5], amount = 11',  output: '3', explanation: '5 + 5 + 1 = 11 (3 coins).' },
        { input: 'coins = [2], amount = 3',        output: '-1', explanation: 'Cannot make 3 with only 2s.' }
      ],
      constraints: ['1 ≤ coins.length ≤ 12', '1 ≤ coins[i] ≤ 2³¹-1', '0 ≤ amount ≤ 10⁴'],
      testCases: [
        { input: '3\n1 5 11\n11',  expected: '1',  label: 'coins=[1,5,11], amount=11' },
        { input: '3\n1 2 5\n11',   expected: '3',  label: 'coins=[1,2,5], amount=11' },
        { input: '1\n2\n3',        expected: '-1', label: 'coins=[2], amount=3' },
        { input: '1\n1\n0',        expected: '0',  label: 'amount=0' }
      ],
      starterCode: {
        python: `import sys

def coinChange(coins: list, amount: int) -> int:
    # ✏️  Write your solution here (bottom-up DP)
    # dp[i] = min coins to make amount i
    pass

# ─── I/O boilerplate – do not modify ────────────────
def main():
    data = sys.stdin.read().split()
    k = int(data[0])
    coins = [int(data[i+1]) for i in range(k)]
    amount = int(data[k+1])
    print(coinChange(coins, amount))

main()`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here (bottom-up DP)
    // dp[i] = min coins to make amount i
    public static int coinChange(int[] coins, int amount) {
        return -1;
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int k = sc.nextInt();
        int[] coins = new int[k];
        for (int i = 0; i < k; i++) coins[i] = sc.nextInt();
        int amount = sc.nextInt();
        System.out.println(coinChange(coins, amount));
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here (bottom-up DP)
// dp[i] = min coins to make amount i
int coinChange(vector<int>& coins, int amount) {
    return -1;
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    int k; cin >> k;
    vector<int> coins(k);
    for (int& x : coins) cin >> x;
    int amount; cin >> amount;
    cout << coinChange(coins, amount) << "\\n";
    return 0;
}`
      }
    },

    /* ────────────────── 2. Trapping Rain Water ────────────────── */
    {
      id: 'trapping-rain-water',
      title: 'Trapping Rain Water',
      difficulty: 'Medium → Hard',
      diffClass: 'mh',
      tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
      expectedTC: 'O(n)',
      expectedSC: 'O(1)',
      lcUrl: 'https://leetcode.com/problems/trapping-rain-water/',
      statement: `<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>`,
      examples: [
        { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The elevation map traps 6 units of rain water.' },
        { input: 'height = [4,2,0,3,2,5]',               output: '9', explanation: '9 units of water trapped.' }
      ],
      constraints: ['n == height.length', '1 ≤ n ≤ 2×10⁴', '0 ≤ height[i] ≤ 10⁵'],
      testCases: [
        { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expected: '6', label: 'classic example' },
        { input: '6\n4 2 0 3 2 5',              expected: '9', label: '[4,2,0,3,2,5]' },
        { input: '3\n3 0 3',                    expected: '3', label: 'simple valley' },
        { input: '4\n1 0 1 0',                  expected: '1', label: '[1,0,1,0]' }
      ],
      starterCode: {
        python: `import sys

def trap(height: list) -> int:
    # ✏️  Write your solution here
    # Optimal: two-pointer approach O(1) space
    pass

# ─── I/O boilerplate – do not modify ────────────────
data = sys.stdin.read().split()
n = int(data[0])
height = [int(data[i+1]) for i in range(n)]
print(trap(height))`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here
    // Optimal: two-pointer approach O(1) space
    public static int trap(int[] height) {
        return 0;
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] height = new int[n];
        for (int i = 0; i < n; i++) height[i] = sc.nextInt();
        System.out.println(trap(height));
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here
// Optimal: two-pointer approach O(1) space
int trap(vector<int>& height) {
    return 0;
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    int n; cin >> n;
    vector<int> height(n);
    for (int& x : height) cin >> x;
    cout << trap(height) << "\\n";
    return 0;
}`
      }
    },

    /* ────────────────── 3. Longest Increasing Subsequence ────────────────── */
    {
      id: 'lis',
      title: 'Longest Increasing Subsequence',
      difficulty: 'Medium → Hard',
      diffClass: 'mh',
      tags: ['Array', 'Binary Search', 'Dynamic Programming'],
      expectedTC: 'O(n log n)',
      expectedSC: 'O(n)',
      lcUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
      statement: `<p>Given an integer array <code>nums</code>, return the length of the <strong>longest strictly increasing subsequence</strong>.</p>
<p>A <strong>subsequence</strong> is a sequence derived from the array by deleting some elements (possibly none) without changing the order of the remaining elements.</p>`,
      examples: [
        { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'LIS is [2,3,7,101] or [2,5,7,101], length 4.' },
        { input: 'nums = [0,1,0,3,2,3]',          output: '4', explanation: 'LIS is [0,1,2,3], length 4.' },
        { input: 'nums = [7,7,7,7,7,7,7]',        output: '1', explanation: 'All same — longest strictly increasing is length 1.' }
      ],
      constraints: ['1 ≤ nums.length ≤ 2500', '-10⁴ ≤ nums[i] ≤ 10⁴'],
      testCases: [
        { input: '8\n10 9 2 5 3 7 101 18', expected: '4', label: '[10,9,2,5,3,7,101,18]' },
        { input: '6\n0 1 0 3 2 3',          expected: '4', label: '[0,1,0,3,2,3]' },
        { input: '7\n7 7 7 7 7 7 7',        expected: '1', label: 'all same' },
        { input: '5\n1 3 6 7 9',            expected: '5', label: 'already sorted' }
      ],
      starterCode: {
        python: `import sys

def lengthOfLIS(nums: list) -> int:
    # ✏️  Write your solution here
    # O(n²) DP is acceptable; O(n log n) with patience sort is optimal
    pass

# ─── I/O boilerplate – do not modify ────────────────
data = sys.stdin.read().split()
n = int(data[0])
nums = [int(data[i+1]) for i in range(n)]
print(lengthOfLIS(nums))`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here
    // O(n²) DP is acceptable; O(n log n) with patience sort is optimal
    public static int lengthOfLIS(int[] nums) {
        return 0;
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        System.out.println(lengthOfLIS(nums));
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here
// O(n²) DP is acceptable; O(n log n) with patience sort is optimal
int lengthOfLIS(vector<int>& nums) {
    return 0;
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int& x : nums) cin >> x;
    cout << lengthOfLIS(nums) << "\\n";
    return 0;
}`
      }
    },

    /* ────────────────── 4. Number of Islands ────────────────── */
    {
      id: 'number-of-islands',
      title: 'Number of Islands',
      difficulty: 'Medium → Hard',
      diffClass: 'mh',
      tags: ['Array', 'DFS', 'BFS', 'Union Find'],
      expectedTC: 'O(m × n)',
      expectedSC: 'O(m × n)',
      lcUrl: 'https://leetcode.com/problems/number-of-islands/',
      statement: `<p>Given an <code>m × n</code> 2D binary grid where <code>'1'</code> represents land and <code>'0'</code> represents water, return the <em>number of islands</em>.</p>
<p>An <strong>island</strong> is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are surrounded by water.</p>`,
      examples: [
        { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explanation: 'All connected land forms one island.' },
        { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explanation: 'Three separate islands.' }
      ],
      constraints: ['m == grid.length', 'n == grid[i].length', '1 ≤ m, n ≤ 300', 'grid[i][j] is "0" or "1".'],
      testCases: [
        { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expected: '1', label: 'one large island' },
        { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expected: '3', label: 'three islands' },
        { input: '1 1\n1',                                              expected: '1', label: 'single cell' },
        { input: '2 2\n0 0\n0 0',                                       expected: '0', label: 'all water' }
      ],
      starterCode: {
        python: `import sys

def numIslands(grid: list) -> int:
    # ✏️  Write your solution here (DFS or BFS)
    # Sink visited land by marking '0'
    pass

# ─── I/O boilerplate – do not modify ────────────────
def main():
    data = sys.stdin.read().split('\\n')
    r, c = map(int, data[0].split())
    grid = []
    for i in range(1, r+1):
        grid.append(list(data[i].split()))
    print(numIslands(grid))

main()`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here (DFS or BFS)
    // Sink visited land by marking '0'
    public static int numIslands(char[][] grid) {
        return 0;
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt(), c = sc.nextInt();
        char[][] grid = new char[r][c];
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++)
                grid[i][j] = sc.nextInt() == 1 ? '1' : '0';
        System.out.println(numIslands(grid));
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here (DFS or BFS)
// Sink visited land by marking '0'
int numIslands(vector<vector<char>>& grid) {
    return 0;
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    int r, c; cin >> r >> c;
    vector<vector<char>> grid(r, vector<char>(c));
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) {
            int v; cin >> v;
            grid[i][j] = v ? '1' : '0';
        }
    cout << numIslands(grid) << "\\n";
    return 0;
}`
      }
    },

    /* ────────────────── 5. Jump Game II ────────────────── */
    {
      id: 'jump-game-ii',
      title: 'Jump Game II',
      difficulty: 'Medium → Hard',
      diffClass: 'mh',
      tags: ['Array', 'Dynamic Programming', 'Greedy'],
      expectedTC: 'O(n)',
      expectedSC: 'O(1)',
      lcUrl: 'https://leetcode.com/problems/jump-game-ii/',
      statement: `<p>You are given a <strong>0-indexed</strong> array of integers <code>nums</code> of length <code>n</code>. You are initially positioned at <code>nums[0]</code>.</p>
<p>Each element <code>nums[i]</code> represents the <strong>maximum</strong> length of a forward jump from index <code>i</code>. In other words, if you are at index <code>i</code>, you can jump to any index in the range <code>[i+1, i+nums[i]]</code>.</p>
<p>Return the <strong>minimum number of jumps</strong> to reach <code>nums[n-1]</code>. The test cases are generated such that you can always reach <code>nums[n-1]</code>.</p>`,
      examples: [
        { input: 'nums = [2,3,1,1,4]', output: '2', explanation: 'Jump 1→3 (index 0→1), then 3→4 (index 1→4). 2 jumps.' },
        { input: 'nums = [2,3,0,1,4]', output: '2', explanation: 'Index 0→1, then 1→4. 2 jumps.' }
      ],
      constraints: ['1 ≤ nums.length ≤ 10⁴', '0 ≤ nums[i] ≤ 1000', 'You can always reach nums[n-1].'],
      testCases: [
        { input: '5\n2 3 1 1 4', expected: '2', label: '[2,3,1,1,4]' },
        { input: '5\n2 3 0 1 4', expected: '2', label: '[2,3,0,1,4]' },
        { input: '1\n0',         expected: '0', label: 'already at end' },
        { input: '6\n3 4 1 1 0 2', expected: '2', label: '[3,4,1,1,0,2]' }
      ],
      starterCode: {
        python: `import sys

def jump(nums: list) -> int:
    # ✏️  Write your solution here (greedy BFS)
    # Track farthest reachable index at each jump level
    pass

# ─── I/O boilerplate – do not modify ────────────────
data = sys.stdin.read().split()
n = int(data[0])
nums = [int(data[i+1]) for i in range(n)]
print(jump(nums))`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here (greedy BFS)
    // Track farthest reachable index at each jump level
    public static int jump(int[] nums) {
        return 0;
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        System.out.println(jump(nums));
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here (greedy BFS)
// Track farthest reachable index at each jump level
int jump(vector<int>& nums) {
    return 0;
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int& x : nums) cin >> x;
    cout << jump(nums) << "\\n";
    return 0;
}`
      }
    },

    /* ────────────────── 6. Longest Common Subsequence ────────────────── */
    {
      id: 'lcs',
      title: 'Longest Common Subsequence',
      difficulty: 'Medium → Hard',
      diffClass: 'mh',
      tags: ['String', 'Dynamic Programming'],
      expectedTC: 'O(m × n)',
      expectedSC: 'O(m × n)',
      lcUrl: 'https://leetcode.com/problems/longest-common-subsequence/',
      statement: `<p>Given two strings <code>text1</code> and <code>text2</code>, return the length of their <strong>longest common subsequence</strong>. If there is no common subsequence, return <code>0</code>.</p>
<p>A <strong>subsequence</strong> of a string is a sequence derived by deleting some characters (possibly none) without changing the remaining characters' order.</p>
<p>A <strong>common subsequence</strong> is one that is a subsequence of both strings.</p>`,
      examples: [
        { input: 'text1 = "abcde", text2 = "ace"',  output: '3', explanation: 'LCS is "ace", length 3.' },
        { input: 'text1 = "abc", text2 = "abc"',    output: '3', explanation: 'LCS is "abc", length 3.' },
        { input: 'text1 = "abc", text2 = "def"',    output: '0', explanation: 'No common subsequence.' }
      ],
      constraints: ['1 ≤ text1.length, text2.length ≤ 1000', 'text1 and text2 consist of only lowercase English letters.'],
      testCases: [
        { input: 'abcde\nace',   expected: '3', label: '"abcde","ace"' },
        { input: 'abc\nabc',     expected: '3', label: 'identical strings' },
        { input: 'abc\ndef',     expected: '0', label: 'no common chars' },
        { input: 'ezupkr\nubmrapg', expected: '2', label: '"ezupkr","ubmrapg"' }
      ],
      starterCode: {
        python: `import sys

def longestCommonSubsequence(text1: str, text2: str) -> int:
    # ✏️  Write your solution here (2D DP)
    # dp[i][j] = LCS of text1[:i] and text2[:j]
    pass

# ─── I/O boilerplate – do not modify ────────────────
lines = sys.stdin.read().strip().split('\\n')
text1, text2 = lines[0].strip(), lines[1].strip()
print(longestCommonSubsequence(text1, text2))`,
        java: `import java.util.*;

public class Main {

    // ✏️  Write your solution here (2D DP)
    // dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
    public static int longestCommonSubsequence(String text1, String text2) {
        return 0;
    }

    // ─── I/O boilerplate – do not modify ────────────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String text1 = sc.nextLine().trim();
        String text2 = sc.nextLine().trim();
        System.out.println(longestCommonSubsequence(text1, text2));
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// ✏️  Write your solution here (2D DP)
// dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
int longestCommonSubsequence(string text1, string text2) {
    return 0;
}

// ─── I/O boilerplate – do not modify ────────────────
int main() {
    string text1, text2;
    getline(cin, text1);
    getline(cin, text2);
    cout << longestCommonSubsequence(text1, text2) << "\\n";
    return 0;
}`
      }
    }

  ] // end mediumHard

}; // end MOCK_BANK
