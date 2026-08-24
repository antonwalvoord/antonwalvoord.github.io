## Maze Robot

[Source Code](https://github.com/antonwalvoord/semi_autonomous_maze_game)

---

### Topics:
- I2C, Firmware development, C

### Overview:
Designed a maze solving robot game. The robot makes its way through a line and wall based maze using distance, color, and brightness sensors. At each junction of the maze, the robot pauses and waits for the player to tell it to take the left or right path via IEEE 802.15.14 from another board acting as a remote. The robot keeps track of all turns and dead-ends, and upon completion of the maze it replays the optimized path through the maze back to the start.

Based on the [Microbit](https://www.sparkfun.com/micro-bit-v2-board.html) platform and written entirely in C for the Nordic nRF52833 SoC. Wrote drivers for multiple I2C devices including a brightness/color sensor and [H-bridge motor driver](https://www.sparkfun.com/sparkfun-moto-bit-micro-bit-carrier-board-qwiic.html). Additionally wrote gpio drivers for the onboard LED matrix and an external ultrasonic distance sensor.

### Details:

#### State Machine:
The robot is a simple state machine with three high level states: `drive`, `await_command`, and `replay_path`. While in `drive` it acts as a line-follower and wall-detector. Whenever the robot detects a wall it turns around and logs that action in its decision stack. If the robot detects a branching path while in `drive` it will begin to `await_command` and prompt the remote for an instruction. After receiving the command (left or right) it will add it to its decision stack, execute it, and return to `drive`. When the robot eventually detects it has reached the end of the maze (via colored demarcation) it looks through its stack and optimizes the correct path through the maze, culling any mistaken paths. It then turns around and executes this path to return to the start of the maze. Below is a more detailed diagram of all intermediate states:

![Maze solver state overview](/projects/src/maze-robot/overview.png)

#### Path Optimization:
In order to optimize the path through the maze, the robot traverses its entire decision stack looking for any times it backtracked due to a dead-end. When it finds a dead-end detection, it looks at the command it recieved immediately prior and following the mistaken turn. If the two match, the robot knows that the correct decision was to instead take the opposite decision. A simple example can be seen below:

![Simple path optimization](/projects/src/maze-robot/simple-path-optimization.png)

More complex dead-ends are possible however. For example, imagine a dead-end which required two junction decisions to reach. In these cases, the decisions immediately prior/following the backtrack will not match one another. Instead the robot will continue stepping outwards from the backtrack until it finds two matching decisions. At this point it can delete all of the decisions it touched and replace them all with a single decision opposite from the two matching steps. The most simple example (2 decisions deep) is shown below, but this works for any depth of backtracking, as well as branches with multiple detected dead-ends.

![Complex path optimization](/projects/src/maze-robot/complex-path-optimization.png)

#### Radio:

`TODO`

#### A Concrete Example:
The following is a somewhat simple maze and stack in which a player has made every single mistake possible:

![Maze Example Init](/projects/src/maze-robot/demo-init.png)

Upon reaching the end of the maze the robot attempts to cull any mistaken branches. It traverses backwards through its decision stack until the first `BACKTRACK` and sees that it is surrounded by two `DECISION_LEFT` nodes. It then frees all three nodes (both left turns, as well as the backtrack itself) and inserts a new `DECISION_RIGHT` node in their place.

![Maze Example Step 1](/projects/src/maze-robot/demo-step-1.png)

After fixing the first mistake, the robot continues to search for `BACKTRACK` nodes. The next `BACKTRACK` it finds is now surrounded by one `DECISION_LEFT` and one `DECISION_RIGHT` after substitution, and so it has to search another layer outwards, now finding matching nodes and replacing all five nodes (including the previously substituted node) with a new `DECISION_LEFT` node.

![Maze Example Step 2](/projects/src/maze-robot/demo-step-2.png)

The robot continues to search for the final `BACKTRACK` node and performs the same steps as above to replace it.

![Maze Example Step 3](/projects/src/maze-robot/demo-step-3.png)

Finally the robot has cleared all `BACKTRACK` nodes and traverses its stack inverting every decision to prepare for and then execute the _optimized_ return trip through the maze, popping each decision as it goes.

![Maze Example Step 4](/projects/src/maze-robot/demo-step-4.png)

### Demos

We had initially baselined using an 8x8 IR sensor for line detection. This sensor neatly packaged a number of sensing points into a single package so we could detect a number of points with which to follow the maze lines and detect junctions. I wrote a driver for the Panasonic Grid-EYE and demoed it below:

![Grideye Demo](/projects/src/maze-robot/grideye-driver.mp4)

Unfortunately, we soon realized that this sensor was a thermal infrared array as opposed to an IR reflectance sensor and we had to pivot to the ADPS-9960 light and RGB sensor which I wrote a new set of drivers for, demoed below. This is the sensor which we ultimately used for both line and goal detection.

![Line Detection Demo](/projects/src/maze-robot/line-sensor-driver.mp4)

Below is a demo showing line following, backtracking, and remote controlling to select path. Unfortunately, the robot was having trouble reliably detecting the lines due to brightness differences across the maze. We tried to counteract this by having the robot calibrate its brightness sensors upon each boot, taking a number of baseline samples to consider "white". This helped but didn't fully solve the problem. We later added front mounted white LEDs to further help keep a constant brightness which helped even more (unfortunately I do not have good video of this).

![Remote Demo](/projects/src/maze-robot/remote-demo.mp4)