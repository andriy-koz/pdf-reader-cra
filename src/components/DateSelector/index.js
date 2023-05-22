import styles from './DateSelector.module.css';

function DateSelector({ selectedDate, onDateChange }) {
  return (
    <div className={styles['date-selector']}>
      <label htmlFor='dateSelector'>Seleccionar fecha: </label>
      <input
        type='date'
        id='dateSelector'
        value={selectedDate || ''}
        onChange={onDateChange}
      />
    </div>
  );
}

export default DateSelector;
