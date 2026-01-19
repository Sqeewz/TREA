'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function saveBMI(height: number, weight: number) {
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)
  
  let category = ''
  if (bmi < 18.5) category = 'Underweight'
  else if (bmi < 25) category = 'Normal weight'
  else if (bmi < 30) category = 'Overweight'
  else category = 'Obesity'

  await prisma.bMIHistory.create({
    data: {
      height,
      weight,
      bmi: parseFloat(bmi.toFixed(2)),
      category,
    },
  })

  revalidatePath('/')
  return { bmi: parseFloat(bmi.toFixed(2)), category }
}

export async function generateMockData() {
  const records = []
  const categories = ['Underweight', 'Normal weight', 'Overweight', 'Obesity']
  
  for (let i = 0; i < 50; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 365)) // Random date within last year
    
    const height = 150 + Math.random() * 50 // 150-200cm
    const weight = 40 + Math.random() * 80 // 40-120kg
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    
    let category = ''
    if (bmi < 18.5) category = 'Underweight'
    else if (bmi < 25) category = 'Normal weight'
    else if (bmi < 30) category = 'Overweight'
    else category = 'Obesity'

    records.push({
      height: parseFloat(height.toFixed(1)),
      weight: parseFloat(weight.toFixed(1)),
      bmi: parseFloat(bmi.toFixed(2)),
      category,
      createdAt: date
    })
  }

  await prisma.bMIHistory.createMany({
    data: records
  })

  revalidatePath('/')
}

export async function getBMIHistory() {
  return await prisma.bMIHistory.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getMISReports() {
  const allData = await prisma.bMIHistory.findMany({
    orderBy: { createdAt: 'asc' }
  })

  const groupBy = (data: typeof allData, keyFn: (d: typeof allData[0]) => string) => {
    const groups: Record<string, { count: number, totalBMI: number }> = {}
    data.forEach(item => {
      const key = keyFn(item)
      if (!groups[key]) groups[key] = { count: 0, totalBMI: 0 }
      groups[key].count++
      groups[key].totalBMI += item.bmi
    })
    return Object.entries(groups).map(([date, stats]) => ({
      date,
      count: stats.count,
      avgBMI: parseFloat((stats.totalBMI / stats.count).toFixed(2))
    })).reverse() // Newest first
  }

  const daily = groupBy(allData, (d) => d.createdAt.toISOString().split('T')[0])
  
  const weekly = groupBy(allData, (d) => {
    const date = new Date(d.createdAt)
    const year = date.getFullYear()
    const firstDay = new Date(year, 0, 1)
    const week = Math.ceil((((date.getTime() - firstDay.getTime()) / 86400000) + firstDay.getDay() + 1) / 7)
    return `${year}-W${week.toString().padStart(2, '0')}`
  })

  const monthly = groupBy(allData, (d) => d.createdAt.toISOString().slice(0, 7)) // YYYY-MM

  const yearly = groupBy(allData, (d) => d.createdAt.toISOString().slice(0, 4)) // YYYY

  return { daily, weekly, monthly, yearly }
}
