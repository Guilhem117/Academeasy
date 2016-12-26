let calendar = [
  {
    id: 0,
    course: 0,
    teacher: 1,
    start: new Date(2016, 11, 26, 12, 0),
    end: new Date(2016, 11, 26, 14, 0),
  },
  {
    id: 1,
    course: 1,
    teacher: 2,
    start: new Date(2016, 11, 26, 16, 0),
    end: new Date(2016, 11, 26, 18, 0),
  },
  {
    id: 2,
    course: 2,
    teacher: 3,
    start: new Date(2016, 11, 26, 18, 0),
    end: new Date(2016, 11, 26, 19, 0),
  }
];

let listeners = [];

const CalendarStore = {
    getCalendar: _ => {
        return calendar.slice();
    },

    getEntry: (entryId) => {
      return calendar.find((entry) => entry.id === entryId);
    },

    updateEntry: (entry) => {
        const arrayPos = calendar.findIndex((s) => {
            return entry.id === s.id;
        });
        if (arrayPos > -1) {
            calendar[arrayPos] = entry;
            CalendarStore.notify();
        }
    },

    removeEntry: (entryId) => {
        const arrayPos = calendar.findIndex((s) => {
            return entryId === s.id;
        });
        if (arrayPos > -1) {
            calendar.splice(arrayPos, 1);
            CalendarStore.notify();
        }
    },

    addEntry: (entry) => {
        let max = 0;
        calendar.forEach((s) => {
            if (s.id > max)
                max = s.id;
            }
        );
        entry.id = max + 1;
        calendar.push(entry);
        CalendarStore.notify();
        return entry.id;
    },

    addListener: (callback) => {
        listeners.push(callback);
    },

    removeListener: (callback) => {
        listeners = listeners.filter((l) => l !== callback);
    },

    notify: _ => {
        listeners.forEach((callback) => callback());
    }

}

export default CalendarStore;
