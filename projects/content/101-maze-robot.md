## Maze Robot

---

### Topics:
- I2C, Firmware development

### Overview:
Designed a maze solving robot game. The robot makes its way through a line and wall based maze using distance, color, and brightness sensors. At each junction of the maze, the robot pauses and waits for the player to tell it to take the left or right path. The robot keeps track of all turns and dead-ends, and upon completion of the maze it replays the optimized path through the maze back to the start.

Based on the [Microbit](https://www.sparkfun.com/micro-bit-v2-board.html) platform and written entirely in C for the Nordic nRF52833 SoC. Wrote drivers for multiple I2C devices including a brightness/color sensor and [H-bridge motor driver](https://www.sparkfun.com/sparkfun-moto-bit-micro-bit-carrier-board-qwiic.html). Additionally wrote gpio drivers for the onboard LED matrix and an external ultrasonic distance sensor.

onboard LED matrix, [moto:bit](https://www.sparkfun.com/sparkfun-moto-bit-micro-bit-carrier-board-qwiic.html)

Used the Microbit and wrote C code for the nrfXXXXX processor. Read sensing data from. Wrote drivers for multiple i2c devices including a i2c mux, brightness and color sensor, motor driver, onboard LED matrix, 

### Details:
Treated as a simple state machine which had 

driving <-> junction -> replaying -> done

During solving the robot acts as a line follower using its two color sensors trying to stay on the line. If both sensors detect a line at the same time, it knows it is at a junction and pauses, prompting the player to give it a direction. This is done by using IEEE 802.15.14 to wirelessly send a message to the "controller" microbit. This microbit illuminates with a "?" to prompt the player. The player then presses left or right and the controller sends a message back to the "driver" robot which logs the decisions and takes the turn. The controller also displays a "<-" or "->" to indicate it properly registered the decision.

State is controlled by a number of variables. The driver keeps track of decision history as a stack. Upon completion it walks through the stack, culling any decision branches which resulted in a dead-end. After processeing the stack, it pops and takes inverted deicions until it completes the maze.

![Maze solver state overview](/overview.png)