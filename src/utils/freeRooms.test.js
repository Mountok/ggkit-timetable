import test from 'node:test'
import assert from 'node:assert/strict'
import { getFreeRoomsAt, normalizeRoom } from './freeRooms.js'

const roomsData = {
  А: ['А101', 'А102'],
  Б: ['Б201'],
  В: ['В301'],
}

const scheduleData = {
  groups: [
    {
      name: 'Тест-1',
      days: [
        {
          name: 'Вторник',
          date: '20.10.2026',
          lessons: [
            { lessonNum: 1, room: 'А101' },
            { lessonNum: 2, room: 'Б201' },
          ],
        },
      ],
    },
  ],
}

const bellsData = {
  tuesday: {
    schedule: [
      { pairNumber: '1', lessonNumbers: '1,2', time: '09:00 – 10:10' },
      { pairNumber: '2', lessonNumbers: '3,4', time: '10:30 – 11:40' },
    ],
  },
}

test('нормализует номера кабинетов и исключает специальные помещения', () => {
  assert.equal(normalizeRoom('112А'), 'А112')
  assert.equal(normalizeRoom(' А 101 '), 'А101')
  assert.equal(normalizeRoom('сп/з'), null)
})

test('находит свободные кабинеты во время пары', () => {
  const result = getFreeRoomsAt({
    now: new Date('2026-10-20T06:30:00.000Z'),
    scheduleData,
    bellsData,
    roomsData,
  })

  assert.equal(result.status, 'lesson')
  assert.deepEqual(result.rooms, { А: ['А102'], Б: [], В: ['В301'] })
  assert.deepEqual(result.occupiedRooms, ['А101', 'Б201'])
  assert.deepEqual(result.occupancies['А101'], [
    { group: 'Тест-1', subject: 'Занятие', teacher: '', lessonNumber: 1 },
  ])
  assert.equal(result.freeRoomsCount, 2)
})

test('во время перемены считает кабинеты свободными', () => {
  const result = getFreeRoomsAt({
    now: new Date('2026-10-20T07:20:00.000Z'),
    scheduleData,
    bellsData,
    roomsData,
  })

  assert.equal(result.status, 'break')
  assert.equal(result.freeRoomsCount, 4)
})

test('не показывает ложный список при отсутствии расписания на дату', () => {
  const result = getFreeRoomsAt({
    now: new Date('2026-10-19T06:30:00.000Z'),
    scheduleData,
    bellsData,
    roomsData,
  })

  assert.equal(result.status, 'no-data')
  assert.equal(result.freeRoomsCount, 0)
  assert.deepEqual(result.rooms, { А: [], Б: [], В: [] })
})

