function DateSelector({ selectedDate, onDateChange }) {
  return (
    <>
      <label htmlFor='dateSelector'>Seleccionar fecha: </label>
      <input
        type='date'
        id='dateSelector'
        value={selectedDate || ''}
        onChange={onDateChange}
      />
    </>
  );
}

export default DateSelector;
