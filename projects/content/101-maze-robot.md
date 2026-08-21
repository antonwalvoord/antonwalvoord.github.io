## Maze Robot

---

### Topics:
- I2C, Firmware development, C

### Overview:
Designed a maze solving robot game. The robot makes its way through a line and wall based maze using distance, color, and brightness sensors. At each junction of the maze, the robot pauses and waits for the player to tell it to take the left or right path via IEEE 802.15.14 from another board acting as a remote. The robot keeps track of all turns and dead-ends, and upon completion of the maze it replays the optimized path through the maze back to the start.

Based on the [Microbit](https://www.sparkfun.com/micro-bit-v2-board.html) platform and written entirely in C for the Nordic nRF52833 SoC. Wrote drivers for multiple I2C devices including a brightness/color sensor and [H-bridge motor driver](https://www.sparkfun.com/sparkfun-moto-bit-micro-bit-carrier-board-qwiic.html). Additionally wrote gpio drivers for the onboard LED matrix and an external ultrasonic distance sensor.

### Details:
The robot is a simple state machine with three high level states: `drive`, `await_command`, and `replay_path`. While in `drive` it acts as a line-follower and wall-detector. Whenever the robot detects a wall it turns around and logs that action in its decision stack. If the robot detects a branching path while in `drive` it will begin to `await_command` and prompt the remote for an instruction. After receiving the command (left or right) it will add it to its decision stack, execute it, and return to `drive`. When the robot eventually detects it has reached the end of the maze (via colored demarcation) it looks through its stack and optimizes the correct path through the maze, culling any mistaken paths. It then turns around and executes this path to return to the start of the maze. Below is a more detailed diagram of all intermediate states:

![Maze solver state overview](/overview.png)