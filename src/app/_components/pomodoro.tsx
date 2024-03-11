'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { serverClient } from '../_trpc/serverClient';
import {
  Button,
  Input,
  Label,
  Text,
  TextField,
  Tooltip,
  TooltipTrigger,
} from 'react-aria-components';
import { trpc } from '../_trpc/client';

interface PomodoroProps {
  settings: Awaited<
    ReturnType<(typeof serverClient)['pomodoro']['getSettings']>
  >;
}

export const Pomodoro = ({ settings }: PomodoroProps) => {
  const [showSettings, setShowSettings] = useState(settings ? false : true)
  const [workDuration, setWorkDuration] = useState<number>(
    settings?.workDuration || 25
  );
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(
    settings?.shortBreakDuration || 5
  );
  const [longBreakDuration, setLongBreakDuration] = useState<number>(
    settings?.longBreakDuration || 15
  );
  const [longBreakInterval, setLongBreakInterval] = useState<number>(
    settings?.longBreakInterval || 4
  );

  const [timeLeft, setTimeLeft] = useState<number>(workDuration * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [pomodoroStage, setPomodoroStage] = useState<string>('work'); // add enum
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  const saveSettings = trpc.pomodoro.upsertSettings.useMutation();

  useEffect(() => {
    const timer: ReturnType<typeof setInterval> | null = isTimerRunning
      ? setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
          if (timeLeft === 1) {
            switchStage();
          }
        }, 1000)
      : null;

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
    saveSettings.mutate({
      workDuration,
      shortBreakDuration,
      longBreakDuration,
      longBreakInterval,
    });
    setTimeLeft(workDuration * 60);
    setIsTimerRunning(false);
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<number>>) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      setter(Number(e.target.value));
    };

  const formatTimeLeft = (): string => {
    const minutes: number = Math.floor(timeLeft / 60);
    const seconds: number = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="p-4 border border-black">
      <h2 className="text-3xl font-extrabold">Pomodoro Timer</h2>
        <div>
          <h3>Timer</h3>
          <div className="text-black font-extrabold text-9xl">
            {formatTimeLeft()}
          </div>
          <div>Stage: {pomodoroStage}</div>
          <TooltipTrigger delay={0}>
            <Button
              isDisabled={!settings}
              onPress={() => setIsTimerRunning(!isTimerRunning)}
              className="text-white bg-black rounded-lg py-2 px-4"
            >
              {isTimerRunning ? 'Pause' : 'Start'}
            </Button>
            <Tooltip className="p-1 border border-gray-200 bg-white rounded-xl">
              Save your settings before using the timer
            </Tooltip>
          </TooltipTrigger>
        </div>
        <Button onPress={() => setShowSettings(!showSettings)} className="text-sm text-blue-500 cursor-pointer hover:text-blue-800">{`${showSettings ? 'hide' : 'show'} settings`}</Button>
        {showSettings && (
          <div>
          <h3>Settings</h3>
          <form className="flex flex-col gap-2" onSubmit={handleSettingsSubmit}>
            <div className="flex flex-wrap gap-2">
              <TextField>
              <Label>Work duration:</Label>
              <Input
                type="number"
                value={workDuration}
                onChange={handleChange(setWorkDuration)}
                placeholder="Work Duration (min)"
              />
            </TextField>
            <TextField>
              <Label>Short break duration:</Label>
              <Input
                type="number"
                value={shortBreakDuration}
                onChange={handleChange(setShortBreakDuration)}
                placeholder="Short Break Duration (min)"
              />
            </TextField>
            <TextField>
              <Label>Long break duration:</Label>
              <Input
                type="number"
                value={longBreakDuration}
                onChange={handleChange(setLongBreakDuration)}
                placeholder="Long Break Duration (min)"
              />
            </TextField>
            <TextField>
              <Label>Long break interval:</Label>
              <Input
                type="number"
                value={longBreakInterval}
                onChange={handleChange(setLongBreakInterval)}
                placeholder="Long Break Interval"
              />
            </TextField>
            </div>
            <Button
              className="border border-black rounded-xl py-2 px-4"
              type="submit"
            >{`${settings ? 'Update' : 'Save'} Settings`}</Button>
          </form>
        </div>
        )}
    </div>
  );
};
