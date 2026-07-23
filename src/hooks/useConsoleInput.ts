import { FormEvent, useState } from 'react';

import { ReadPrompt } from '../types/app';

export function useConsoleInput(readPrompt?: ReadPrompt) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmitInput = (event: FormEvent) => {
    event.preventDefault();
    if (!readPrompt) return;

    readPrompt.callback(inputValue);
    setInputValue('');
  };

  return { inputValue, setInputValue, handleSubmitInput };
}
