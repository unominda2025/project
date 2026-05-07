import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ===== THAY THÔNG TIN CỦA BẠN =====
const SUPABASE_URL = 'https://hhxsiutlbvtynkwlsbkr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeHNpdXRsYnZ0eW5rd2xzYmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMzMzMzksImV4cCI6MjA5MzYwOTMzOX0.IeopLqxMKgvmtmz7PQve0GlEp67V1leGrxo3eWVW-NU'
// ==================================

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

const form = document.getElementById('product-form')
const productList = document.getElementById('product-list')
const loading = document.getElementById('loading')

async function loadProducts() {

  loading.style.display = 'block'

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false })

  loading.style.display = 'none'

  if (error) {
    alert(error.message)
    return
  }

  productList.innerHTML = ''

  data.forEach(product => {

    const li = document.createElement('li')

    li.innerHTML = `
      <span>
        ${product.name} - ${product.price.toLocaleString()}đ
      </span>

      <button class="delete-btn" data-id="${product.id}">
        Xóa
      </button>
    `

    productList.appendChild(li)
  })

  bindDeleteButtons()
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('name').value
  const price = document.getElementById('price').value

  const { error } = await supabase
    .from('products')
    .insert([
      {
        name,
        price
      }
    ])

  if (error) {
    alert(error.message)
    return
  }

  form.reset()

  loadProducts()
})

function bindDeleteButtons() {

  document.querySelectorAll('.delete-btn')
    .forEach(button => {

      button.addEventListener('click', async () => {

        const id = button.dataset.id

        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id)

        if (error) {
          alert(error.message)
          return
        }

        loadProducts()
      })
    })
}

loadProducts()
