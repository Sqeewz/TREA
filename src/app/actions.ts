'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

export async function saveBMI(height: number, weight: number, gender: string, age: number) {
  const session = await getSession()
  const userId = session?.userId
  
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)
  
  let category = ''
  let recommendation = ''
  
  if (bmi < 18.5) {
    category = 'Underweight'
    recommendation = 'ควรรับประทานอาหารที่มีประโยชน์และเพิ่มปริมาณอาหารให้เหมาะสม'
    if (gender === 'female') recommendation += ' และควรเสริมธาตุเหล็กและแคลเซียม'
  } else if (bmi < 25) {
    category = 'Normal weight'
    recommendation = 'รักษาสุขภาพให้แข็งแรง ออกกำลังกายอย่างสม่ำเสมอ'
    if (gender === 'male') recommendation += ' ควรเน้นการสร้างกล้ามเนื้อเพื่อความแข็งแรง'
    if (age > 60) recommendation += ' ผู้สูงอายุควรระวังเรื่องมวลกล้ามเนื้อและโภชนาการ'
  } else if (bmi < 30) {
    category = 'Overweight'
    recommendation = 'ควรควบคุมอาหารและออกกำลังกายเพื่อลดน้ำหนัก'
  } else {
    category = 'Obesity'
    recommendation = 'ควรปรึกษาแพทย์เพื่อรับคำแนะนำในการลดน้ำหนัก'
  }

  if (age < 20) {
    recommendation += ' (สำหรับผู้ที่มีอายุต่ำกว่า 20 ปี ควรใช้กราฟการเจริญเติบโตในการประเมินเพิ่มเติม)'
  }

  await prisma.bMIHistory.create({
    data: {
      height,
      weight,
      bmi: parseFloat(bmi.toFixed(2)),
      category,
      gender,
      age,
      userId: userId ? parseInt(userId) : null
    },
  })

  revalidatePath('/')
  return { bmi: parseFloat(bmi.toFixed(2)), category, recommendation }
}

export async function generateMockData() {
  const session = await getSession()
  const userId = session?.userId ? parseInt(session.userId) : null

  const records = []
  const categories = ['Underweight', 'Normal weight', 'Overweight', 'Obesity']
  
  for (let i = 0; i < 50; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 365)) // Random date within last year
    
    const height = 150 + Math.random() * 50 // 150-200cm
    const weight = 40 + Math.random() * 80 // 40-120kg
    const gender = Math.random() > 0.5 ? 'male' : 'female'
    const age = Math.floor(15 + Math.random() * 60) // 15-75 years old

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
      gender,
      age,
      createdAt: date,
      userId
    })
  }

  await prisma.bMIHistory.createMany({
    data: records
  })

  revalidatePath('/')
}

export async function getBMIHistory() {
  const session = await getSession()
  const userId = session?.userId ? parseInt(session.userId) : null

  return await prisma.bMIHistory.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getMISReports() {
  const session = await getSession()
  const userId = session?.userId ? parseInt(session.userId) : null

  const allData = await prisma.bMIHistory.findMany({
    where: {
      userId: userId
    },
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
