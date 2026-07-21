export function mergeOrAppendAlarm(existingAlarms, newAlarm, windowMs = 30000) {
  const newAlarmWithCount = { ...newAlarm, count: newAlarm.count || 1 };
  
  if (!existingAlarms || existingAlarms.length === 0) {
    return [newAlarmWithCount];
  }

  const matchIndex = existingAlarms.findIndex(a => 
    a.nodeId === newAlarm.nodeId && 
    (
      (a.messageData && newAlarm.messageData && a.messageData.paramKey === newAlarm.messageData.paramKey) || 
      a.message === newAlarm.message
    )
  );

  if (matchIndex !== -1) {
    const existingAlarm = existingAlarms[matchIndex];
    const existingTime = new Date(existingAlarm.timestamp).getTime();
    const newTime = new Date(newAlarm.timestamp).getTime();

    if (newTime - existingTime <= windowMs) {
      const updatedAlarms = [...existingAlarms];
      updatedAlarms[matchIndex] = {
        ...existingAlarm,
        count: (existingAlarm.count || 1) + 1,
        timestamp: newAlarm.timestamp,
        messageData: newAlarm.messageData || existingAlarm.messageData
      };
      
      const alarmToMove = updatedAlarms.splice(matchIndex, 1)[0];
      updatedAlarms.unshift(alarmToMove);
      
      return updatedAlarms;
    }
  }

  return [newAlarmWithCount, ...existingAlarms];
}
