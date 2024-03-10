"use client"

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';

export const Pomodoro: React.FC = () => {
  // State with types
  const [workDuration, setWorkDuration] = useState<number>(25);
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(5);
  const [longBreakDuration, setLongBreakDuration] = useState<number>(15);
  const [longBreakInterval, setLongBreakInterval] = useState<number>(4);

  // Timer states
  const [timeLeft, setTimeLeft] = useState<number>(workDuration * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [pomodoroStage, setPomodoroStage] = useState<string>('work'); // Could be an enum
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  useEffect(() => {
    const timer: ReturnType<typeof setInterval> | null = isTimerRunning ? setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
      if (timeLeft === 1) {
        switchStage();
      }
    }, 1000) : null;

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTimerRunning, timeLeft]);

  const switchStage = (): void => {
    if (pomodoroStage === 'work') {
      if ((cyclesCompleted + 1) % longBreakInterval === 0) {
        setPomodoroStage('longBreak');
        setTimeLeft(longBreakDuration * 60);
      } else {
        setPomodoroStage('shortBreak');
        setTimeLeft(shortBreakDuration * 60);
      }
      setCyclesCompleted(cyclesCompleted + 1);
    } else {
      setPomodoroStage('work');
      setTimeLeft(workDuration * 60);
    }
  };

  const handleSettingsSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Here, integrate with your upsertSettings mutation to save settings
    setTimeLeft(workDuration * 60);
    setIsTimerRunning(false);
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: ChangeEvent<HTMLInputElement>): void => {
    setter(Number(e.target.value));
  };

  const formatTimeLeft = (): string => {
    const minutes: number = Math.floor(timeLeft / 60);
    const seconds: number = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <h2>Pomodoro Timer</h2>
      <div>
        <h3>Settings</h3>
        <form onSubmit={handleSettingsSubmit}>
          <input type="number" value={workDuration} onChange={handleChange(setWorkDuration)} placeholder="Work Duration (min)" />
          <input type="number" value={shortBreakDuration} onChange={handleChange(setShortBreakDuration)} placeholder="Short Break Duration (min)" />
          <input type="number" value={longBreakDuration} onChange={handleChange(setLongBreakDuration)} placeholder="Long Break Duration (min)" />
          <input type="number" value={longBreakInterval} onChange={handleChange(setLongBreakInterval)} placeholder="Long Break Interval" />
          <button type="submit">Save Settings</button>
        </form>
      </div>
      <div>
        <h3>Timer</h3>
        <div>{formatTimeLeft()}</div>
        <div>Stage: {pomodoroStage}</div>
        <button onClick={() => setIsTimerRunning(!isTimerRunning)}>
          {isTimerRunning ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  );
};

