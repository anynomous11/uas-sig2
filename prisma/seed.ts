import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@desabanyuputih.id',
      password: 'admin123', // In production, this should be hashed
      fullName: 'Administrator Desa',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Created admin user:', adminUser.username);

  // Create default operator user
  const operatorUser = await prisma.user.upsert({
    where: { username: 'operator' },
    update: {},
    create: {
      username: 'operator',
      email: 'operator@desabanyuputih.id',
      password: 'operator123',
      fullName: 'Operator GIS Desa',
      role: 'OPERATOR',
      isActive: true,
    },
  });
  console.log('✅ Created operator user:', operatorUser.username);

  // Create categories
  const categories = [
    { name: 'Kantor Pemerintahan', icon: 'Building2', color: '#3B82F6', description: 'Kantor desa, balai desa, dan fasilitas pemerintahan' },
    { name: 'Pendidikan', icon: 'GraduationCap', color: '#10B981', description: 'Sekolah, TK, PAUD, dan lembaga pendidikan lainnya' },
    { name: 'Kesehatan', icon: 'Heart', color: '#EF4444', description: 'Puskesmas, posyandu, apotek, dan fasilitas kesehatan' },
    { name: 'Tempat Ibadah', icon: 'Church', color: '#8B5CF6', description: 'Masjid, musholla, dan tempat ibadah lainnya' },
    { name: 'Fasilitas Umum', icon: 'Users', color: '#F59E0B', description: 'Lapangan, balai RT/RW, dan fasilitas publik lainnya' },
    { name: 'UMKM', icon: 'Store', color: '#EC4899', description: 'Usaha mikro, kecil, dan menengah' },
    { name: 'Pertanian', icon: 'Wheat', color: '#84CC16', description: 'Sawah, kebun, dan lahan pertanian' },
    { name: 'Infrastruktur', icon: 'Route', color: '#6366F1', description: 'Jalan, jembatan, irigasi, dan infrastruktur lainnya' },
    { name: 'Wisata', icon: 'Camera', color: '#14B8A6', description: 'Tempat wisata dan objek menarik' },
    { name: 'Pemakaman', icon: 'Landmark', color: '#71717A', description: 'Area pemakaman umum' },
  ];

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { id: category.name.toLowerCase().replace(/\s/g, '-') },
      update: {},
      create: {
        id: category.name.toLowerCase().replace(/\s/g, '-'),
        name: category.name,
        icon: category.icon,
        color: category.color,
        description: category.description,
        isActive: true,
      },
    });
    console.log('✅ Created category:', created.name);
  }

  // Create sample locations
  const sampleLocations = [
    {
      name: 'Kantor Desa Banyuputih',
      description: 'Kantor pemerintahan Desa Banyuputih',
      address: 'Jl. Raya Banyuputih No. 1, Kalinyamatan, Jepara',
      categoryId: 'kantor-pemerintahan',
      geometry: JSON.stringify({ type: 'Point', coordinates: [110.7428, -6.7089] }),
    },
    {
      name: 'Masjid Baiturrahman',
      description: 'Masjid utama Desa Banyuputih',
      address: 'Jl. Masjid No. 10, Banyuputih',
      categoryId: 'tempat-ibadah',
      geometry: JSON.stringify({ type: 'Point', coordinates: [110.7435, -6.7095] }),
    },
    {
      name: 'SD Negeri 1 Banyuputih',
      description: 'Sekolah Dasar Negeri 1 Banyuputih',
      address: 'Jl. Pendidikan No. 5, Banyuputih',
      categoryId: 'pendidikan',
      geometry: JSON.stringify({ type: 'Point', coordinates: [110.7420, -6.7080] }),
    },
    {
      name: 'Posyandu Melati',
      description: 'Posyandu untuk kesehatan ibu dan anak',
      address: 'Jl. Kesehatan No. 3, Banyuputih',
      categoryId: 'kesehatan',
      geometry: JSON.stringify({ type: 'Point', coordinates: [110.7445, -6.7100] }),
    },
    {
      name: 'Lapangan Desa',
      description: 'Lapangan olahraga dan kegiatan masyarakat',
      address: 'Jl. Olahraga No. 1, Banyuputih',
      categoryId: 'fasilitas-umum',
      geometry: JSON.stringify({ type: 'Point', coordinates: [110.7438, -6.7085] }),
    },
  ];

  for (const location of sampleLocations) {
    const existing = await prisma.location.findFirst({
      where: { name: location.name },
    });

    if (!existing) {
      const created = await prisma.location.create({
        data: {
          ...location,
          createdBy: adminUser.id,
          status: 'ACTIVE',
        },
      });
      console.log('✅ Created location:', created.name);
    } else {
      console.log('⏭️ Location already exists:', location.name);
    }
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
