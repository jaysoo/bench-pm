This repo benchmarks the change where we read packageManager field and determine version from that instead of running `<pm> --version`.

Note: This is with a locally published version from the PR (https://github.com/nrwl/nx/pull/29249)

The `getPackageManagerVersion` function itself sees a 16x speedup if we parse `package.json` first and skip creating a process.

```shell
hyperfine -n before 'node run.mjs --before' -n after 'node run.mjs'
Benchmark 1: before
  Time (mean ± σ):      8.991 s ±  0.612 s    [User: 5.987 s, System: 1.682 s]
  Range (min … max):    8.339 s … 10.018 s    10 runs
 
Benchmark 2: after
  Time (mean ± σ):      97.1 ms ±  15.5 ms    [User: 95.4 ms, System: 20.5 ms]
  Range (min … max):    84.5 ms … 131.2 ms    34 runs
 
  Warning: Statistical outliers were detected. Consider re-running this benchmark on a quiet system without any interferences from other programs. It might help to use the '--warmup' or '--prepare' options.
 
Summary
  after ran
   92.57 ± 16.10 times faster than before
```

---

To measure impact on graph creation, I've added some plugins, which all call `getPackageManagerCommand`, which then calls `getPackageManagerVersion`. I'm just running `nx report` without daemon, so the plugins load always.

BEFORE (on "slow" branch, no `packageManager` field):

```
NX_DAEMON=false hyperfine "nx report"
Benchmark 1: nx report
  Time (mean ± σ):     594.0 ms ±  30.4 ms    [User: 301.6 ms, System: 96.7 ms]
  Range (min … max):   559.4 ms … 667.5 ms    10 runs
```

AFTER:

```
NX_DAEMON=false hyperfine "nx report"
Benchmark 1: nx report
  Time (mean ± σ):     520.4 ms ±  54.1 ms    [User: 244.4 ms, System: 82.1 ms]
  Range (min … max):   485.0 ms … 667.5 ms    10 runs
```

You can see, about 80ms difference. This difference grows larger the more plugins you use.
