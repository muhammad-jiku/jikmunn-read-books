import { MinusCircle, Moon, PlusCircle, RotateCcw, Sun, Type } from 'lucide-react';
import React from 'react';
import {
  resetReaderSettings,
  selectReaderSettings,
  updateReaderSettings,
} from '../../redux/features/ebookSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import type { ReaderSettings } from '../../types/ebook';

const ReaderSettingsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectReaderSettings);

  const handleSettingChange = <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K],
  ) => {
    dispatch(updateReaderSettings({ [key]: value }));
  };

  const handleReset = () => {
    dispatch(resetReaderSettings());
  };

  const fontFamilies = ['Georgia', 'Arial', 'Times New Roman', 'Verdana'];

  return (
    <div className='p-4 bg-background border border-border rounded-lg shadow-lg w-72'>
      <div className='space-y-6'>
        {/* Font Size Controls */}
        <div>
          <label className='block text-sm font-medium mb-2'>Font Size</label>
          <div className='flex items-center space-x-4'>
            <button
              onClick={() => handleSettingChange('fontSize', Math.max(12, settings.fontSize - 2))}
              className='p-2 hover:bg-primary/10 rounded-full'
              title='Decrease font size'
            >
              <MinusCircle className='w-5 h-5' />
            </button>
            <span className='text-sm'>{settings.fontSize}px</span>
            <button
              onClick={() => handleSettingChange('fontSize', Math.min(24, settings.fontSize + 2))}
              className='p-2 hover:bg-primary/10 rounded-full'
              title='Increase font size'
            >
              <PlusCircle className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Line Height */}
        <div>
          <label className='block text-sm font-medium mb-2'>Line Height</label>
          <input
            type='range'
            min={1}
            max={2}
            step={0.1}
            value={settings.lineHeight}
            onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
            className='w-full'
            title='Adjust line height'
            aria-label='Line height adjustment'
          />
          <div className='text-sm text-center mt-1'>{settings.lineHeight.toFixed(1)}</div>
        </div>

        {/* Font Family */}
        <div>
          <label className='block text-sm font-medium mb-2'>Font Family</label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
            className='w-full p-2 rounded-md border border-border bg-background'
            title='Choose font family'
            aria-label='Font family selection'
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Selection */}
        <div>
          <label className='block text-sm font-medium mb-2'>Theme</label>
          <div className='flex justify-between space-x-2'>
            <button
              onClick={() => handleSettingChange('theme', 'light')}
              className={`flex-1 p-2 rounded-md flex items-center justify-center space-x-2 ${
                settings.theme === 'light'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border'
              }`}
            >
              <Sun className='w-4 h-4' />
              <span>Light</span>
            </button>
            <button
              onClick={() => handleSettingChange('theme', 'sepia')}
              className={`flex-1 p-2 rounded-md flex items-center justify-center space-x-2 ${
                settings.theme === 'sepia'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border'
              }`}
            >
              <Type className='w-4 h-4' />
              <span>Sepia</span>
            </button>
            <button
              onClick={() => handleSettingChange('theme', 'dark')}
              className={`flex-1 p-2 rounded-md flex items-center justify-center space-x-2 ${
                settings.theme === 'dark'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border'
              }`}
            >
              <Moon className='w-4 h-4' />
              <span>Dark</span>
            </button>
          </div>
        </div>

        {/* Margin */}
        <div>
          <label className='block text-sm font-medium mb-2'>Page Margins</label>
          <input
            type='range'
            min={0}
            max={40}
            step={5}
            value={settings.margin}
            onChange={(e) => handleSettingChange('margin', parseInt(e.target.value))}
            className='w-full'
            title='Adjust page margins'
            aria-label='Page margin adjustment'
          />
          <div className='text-sm text-center mt-1'>{settings.margin}px</div>
        </div>

        {/* Brightness */}
        <div>
          <label className='block text-sm font-medium mb-2'>Brightness</label>
          <input
            type='range'
            min={50}
            max={100}
            step={5}
            title='Adjust brightness'
            aria-label='Brightness adjustment'
            value={settings.brightness}
            onChange={(e) => handleSettingChange('brightness', parseInt(e.target.value))}
            className='w-full'
          />
          <div className='text-sm text-center mt-1'>{settings.brightness}%</div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className='w-full flex items-center justify-center space-x-2 p-2 border border-border rounded-md hover:bg-primary/10'
        >
          <RotateCcw className='w-4 h-4' />
          <span>Reset to Default</span>
        </button>
      </div>
    </div>
  );
};

export default ReaderSettingsPanel;
