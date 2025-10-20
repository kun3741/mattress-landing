import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { getDatabase } from '../lib/mongodb'

async function updateFactories() {
  const db = await getDatabase()
  const list = [
    { name: 'Brand 1', logo: '/1 logo 10.png' },
    { name: 'Come-for', logo: '/come-for.png' },
    { name: 'EMM', logo: '/emm.150x100.jpg' },
    { name: 'Evolution', logo: '/evolution_2024.150x100.jpg' },
    { name: 'BRN', logo: '/fabrika_brn-o7uhcpocfs6s1sa5b6n2l3usbvnih4qa43kodvvg9s.png' },
    { name: 'Fashion', logo: '/fashion_logo.150x100.jpg' },
    { name: 'FDM', logo: '/FDM big.png' },
    { name: 'K1', logo: '/k1-200x120.png' },
    { name: 'K6', logo: '/k6-200x120.png' },
    { name: 'K8', logo: '/k8-200x120.png' },
    { name: 'Karib', logo: '/karib.png' },
    { name: 'Keiko', logo: '/keiko-col-main-200x120.png' },
    { name: 'Arabeska', logo: '/logo_arabeska_150x100.150x100.png' },
    { name: 'Belsonno', logo: '/logo_belsonno_150x100.150x100.png' },
    { name: 'Palmera', logo: '/logo_palmera.150x100.jpg' },
    { name: 'Logo Ukr', logo: '/Logo_ukr.jpg' },
    { name: 'Brand 2', logo: '/logo-2-400x164.png' },
    { name: 'Belsonno Pure', logo: '/logo-belsonno-pure-01-1-150x37.png' },
    { name: 'Колекції', logo: '/logo-kolektsii-dlya-sajtu.150x100.jpg' },
    { name: 'Magniflex', logo: '/logo-magniflex.png' },
  ]

  await db.collection('site_content').findOneAndUpdate(
    { key: 'factories' },
    { $set: { value: list, updated_at: new Date() } },
    { upsert: true }
  )

  console.log(`✅ Updated factories list with ${list.length} items`)
}

if (require.main === module) {
  updateFactories().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
}

export default updateFactories
