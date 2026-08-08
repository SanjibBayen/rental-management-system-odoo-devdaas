import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Alpha a7 III Mirrorless Camera',
    brand: 'Sony',
    category: 'Electronics',
    pricePerDay: 45,
    rating: 4.9,
    reviewsCount: 128,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzcjRqJwrhzVtpDy1fdT87wiHk_-QiXcuAxQQRFuK3QVTXPfyg5ZD9BleWmflUUn2GZCGYaqUVE1ryGtOOLhI7UqyXpM7zzRnVv6WEjfgiSBDctrZbaEtts06FGQY4WDKDsNbJA9pDSZEbHo-Q08OE3vJkHT7aybsj476OtlZtGpYUKZmHrPP8F6NkTGHSVg6yDzkeJWZi0W1BJ5DZQvTRRly9_JfLyjWbGfBXMIyUUoAZbUukyoqnqg',
    badge: { text: 'Top Rated', type: 'info' }
  },
  {
    id: '2',
    name: 'Mavic 3 Pro Cine Premium Combo',
    brand: 'DJI',
    category: 'Electronics',
    pricePerDay: 89,
    rating: 4.7,
    reviewsCount: 84,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEeT6wxHEY8hmL82BuMoz5rihZgxeWbpggQgAHG3ui3JNEu4we9v7hEjQQn0JHo7JWy12YPU5RyWsejaEl-vqB7rlRQuJyKpVOfkN7qQ3r086dqlYbRNVNLETsS9cXt7Wz6t1UfV26VSZVdgch9-RBnqR80CoAvuBvS1RyipY84MLN81SfXVW1oZ9xS8Imn7jeMnqi-0JUOw1V4lpPn0IXvbiaiKip7nCWM4_jQVp28c28fjorO6C68Q'
  },
  {
    id: '3',
    name: 'TF1 Digital Mixing Console',
    brand: 'Yamaha',
    category: 'Electronics',
    pricePerDay: 120,
    rating: 5.0,
    reviewsCount: 22,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASe-vHpBsFbpKf9-wA4xzl2qOcebaS-PUUY5zKepRRsEMS39BUl-OcVtMk1Hczbf6Mj04iZxqL6I6i92pyeFpH-klo-Q_CTOz2Z4PsZ4FRSvOJPP-J3d6sbFq6EuIO7gRdxSE0hwdS3PkBCg-mhyy9TssP3dycOOB571wTeIEgdyUuA-Q3zE2Lp4nQzNkKDidiDkVJN_YnU0xzhhCss4dvUjSwYMVUGzG10tD5jtgDCVyHQayafHpqGw'
  },
  {
    id: '4',
    name: 'LS 600d Pro Light Storm',
    brand: 'Aputure',
    category: 'Electronics',
    pricePerDay: 65,
    rating: 4.8,
    reviewsCount: 56,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIpr8HagOJILC2CboVTflBmY1awtuBad-RDUjZwfPcbt_ebnPap8Q7o0o3Z1Wwy7FyXmSB9PcyX0csfDEXeH5AKB5Jbo1e3ss7JXjUYwmsXIt1Q2tBlBpt-f4jVtVNyPii6a1-2EPcmM2IsVpza29JK-55Myd2iM-PWoJcGQyv9zbByW5C_G0fd_nYzByJMsRIhb2xAdMCxmKpetghHeUP6mpC1dNZbAzXQeWcgYcVjkW2kRkYtSbBKQ',
    badge: { text: 'Available Now', type: 'success' }
  },
  {
    id: '5',
    name: 'MacBook Pro 16" M2 Max',
    brand: 'Apple',
    category: 'Electronics',
    pricePerDay: 95,
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc7APU7pDXbPmoBfLcF2qw6XgYIcVzGMkxrsCEFz3P8M8NaJOwQ-tiB-Vv9f6aqtLMWtu2E0eh7eA_tSGmEFcH4pJuKv_wZq2yVYzVLgcrnDehuTmtYRexI3CgmQdJyxDEeBESkpqdKPobdpaqJf8S4jib90wdbt-LYhMtNePss0-qZRji315cDOSt8z0Ko9t4l0arcESV_AHrmFSJGZCusGVFgA_Ap0_Vp1lF4XWQXuLAHnlDdW-Udg'
  },
  {
    id: '6',
    name: 'CN-E 50mm T1.3 L F Cine Lens',
    brand: 'Canon',
    category: 'Electronics',
    pricePerDay: 55,
    rating: 4.6,
    reviewsCount: 45,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHCJIb0AmTQQbTA84X8_-P6ixmSK-l78TgXgwK-MQ0SgD945AtxVUQQAWd0W0kNoNamwHxnc4MXIgXJ6bh-n5i5iwkvUq6vNLVTygElFbDzPYinp67wjVQBsU5ycFoeDBSYv7j_SU98_uX3uueLid27KntvgNQa79hsZ_UUtOdmw43Mjl3vCLoMMc6WggqtTXVW1O-Es_fh8qVKa3TAonPXgvBDTzLowZ7zJzCtybTYT4ds03AFpbf7A',
    badge: { text: 'Only 2 left', type: 'default' }
  }
];
