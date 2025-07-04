 function requireAuth(roles) {
            return { name: 'Admin', role: 'admin' };
        }

        function logout() {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                window.location.href = 'index.html';
            }
        }

        function formatCurrency(amount) {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP'
            }).format(amount);
        }

        // Variables globales
        let currentTab = 'overview';
        let inventory = [];
        let staff = [];

        document.addEventListener('DOMContentLoaded', function() {
            // Require authentication
            const user = requireAuth(['admin']);
            if (!user) return;
            
            // Initialize dashboard
            initializeAdminDashboard();
            
            // Load mock data
            loadMockData();
            
            // Show initial tab
            showTab('overview');
            
            // Update stats
            updateStats();
        });

        function initializeAdminDashboard() {
            // Add event listeners
            const addItemForm = document.getElementById('addItemForm');
            if (addItemForm) {
                addItemForm.addEventListener('submit', handleAddItem);
            }

            const addStaffForm = document.getElementById('addStaffForm');
            if (addStaffForm) {
                addStaffForm.addEventListener('submit', handleAddStaff);
            }
            
            const searchInput = document.getElementById('searchInventory');
            if (searchInput) {
                searchInput.addEventListener('input', handleSearchInventory);
            }
        }

        function loadMockData() {
            // Mock inventory data
            inventory = [
                {
                    id: '1',
                    name: 'Vacuna Antirrábica',
                    category: 'Vacunas',
                    quantity: 25,
                    minStock: 10,
                    price: 55000,
                    supplier: 'VetSupply Co.',
                    expiryDate: '2024-12-31'
                },
                {
                    id: '2',
                    name: 'Antibiótico Amoxicilina',
                    category: 'Medicamentos',
                    quantity: 5,
                    minStock: 15,
                    price: 80000,
                    supplier: 'MedVet Inc.',
                    expiryDate: '2024-08-15'
                },
                {
                    id: '3',
                    name: 'Jeringas 5ml',
                    category: 'Material Médico',
                    quantity: 100,
                    minStock: 50,
                    price: 30000,
                    supplier: 'Medical Supplies Ltd.',
                    expiryDate: '2026-01-01'
                }
            ];
            
            // Mock staff data
            staff = [
                {
                    id: '1',
                    name: 'Dr. María García',
                    role: 'Veterinario Senior',
                    email: 'maria@petsalud.com',
                    phone: '+1234567890',
                    status: 'active'
                },
                {
                    id: '2',
                    name: 'Dr. Carlos López',
                    role: 'Veterinario',
                    email: 'carlos@petsalud.com',
                    phone: '+1234567891',
                    status: 'active'
                },
                {
                    id: '3',
                    name: 'Ana Martínez',
                    role: 'Asistente Veterinario',
                    email: 'ana@petsalud.com',
                    phone: '+1234567892',
                    status: 'active'
                }
            ];
            
            // Render initial data
            renderOverview();
            renderInventory();
            renderStaff();
        }

        function updateStats() {
            const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
            const totalInventoryValue = inventory.reduce((acc, item) => acc + (item.quantity * item.price), 0);
            const activeStaffCount = staff.filter(s => s.status === 'active').length;
            
            document.getElementById('totalInventory').textContent = inventory.length;
            document.getElementById('lowStock').textContent = lowStockItems.length;
            document.getElementById('activeStaff').textContent = activeStaffCount;
            document.getElementById('inventoryValue').textContent = formatCurrency(totalInventoryValue);
        }

        function showTab(tabName) {
            // Hide all tabs
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Remove active class from all tab buttons
            const tabButtons = document.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Show selected tab
            const selectedTab = document.getElementById(tabName + 'Tab');
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Add active class to selected tab button
            const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
            if (selectedButton) {
                selectedButton.classList.add('active');
            }
            
            currentTab = tabName;
        }

        function renderOverview() {
            const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
            
            // Show/hide low stock alert
            const lowStockAlert = document.getElementById('lowStockAlert');
            const lowStockItemsContainer = document.getElementById('lowStockItems');
            
            if (lowStockItems.length > 0) {
                lowStockAlert.style.display = 'block';
                lowStockItemsContainer.innerHTML = lowStockItems.map(item => `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span>${item.name}</span>
                        <span style="font-weight: 600;">${item.quantity} unidades (Mín: ${item.minStock})</span>
                    </div>
                `).join('');
            } else {
                lowStockAlert.style.display = 'none';
            }
            
            // Render inventory categories
            const categories = [...new Set(inventory.map(item => item.category))];
            const inventoryCategories = document.getElementById('inventoryCategories');
            if (inventoryCategories) {
                inventoryCategories.innerHTML = categories.map(category => {
                    const categoryItems = inventory.filter(item => item.category === category);
                    return `
                        <div class="category-item">
                            <span class="category-name">${category}</span>
                            <span class="category-count">${categoryItems.length} items</span>
                        </div>
                    `;
                }).join('');
            }
            
            // Render staff roles
            const roles = [...new Set(staff.map(person => person.role))];
            const staffRoles = document.getElementById('staffRoles');
            if (staffRoles) {
                staffRoles.innerHTML = roles.map(role => {
                    const roleCount = staff.filter(person => person.role === role && person.status === 'active').length;
                    return `
                        <div class="category-item">
                            <span class="category-name">${role}</span>
                            <span class="category-count">${roleCount} personas</span>
                        </div>
                    `;
                }).join('');
            }
        }

        function renderInventory() {
            const inventoryTable = document.getElementById('inventoryTable');
            if (!inventoryTable) return;
            
            inventoryTable.innerHTML = inventory.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>
                        <span class="status-badge ${item.quantity <= item.minStock ? 'stock-low' : 'stock-good'}">
                            ${item.quantity} / ${item.minStock}
                        </span>
                    </td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${item.supplier}</td>
                    <td>${item.expiryDate}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editItem('${item.id}')">
                            ✏️
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')">
                            🗑️
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        function renderStaff() {
            const staffGrid = document.getElementById('staffGrid');
            if (!staffGrid) return;
            
            staffGrid.innerHTML = staff.map(person => `
                <div class="staff-card">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                            <div>
                                <h3 class="card-title">${person.name}</h3>
                                <p class="card-subtitle">${person.role}</p>
                            </div>
                            <span class="status-badge status-${person.status}">
                                ${person.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <p style="color: #6b7280; margin-bottom: 4px;">📧 ${person.email}</p>
                            <p style="color: #6b7280;">📞 ${person.phone}</p>
                        </div>
                        
                        <div class="card-actions">
                            <button class="btn btn-primary" onclick="editStaff('${person.id}')">
                                ✏️ Editar
                            </button>
                            <button class="btn btn-danger" onclick="deleteStaff('${person.id}')">
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function handleSearchInventory() {
            const searchTerm = document.getElementById('searchInventory').value.toLowerCase();
            const filteredInventory = inventory.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm)
            );
            
            // Re-render with filtered results
            const inventoryTable = document.getElementById('inventoryTable');
            if (!inventoryTable) return;
            
            inventoryTable.innerHTML = filteredInventory.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>
                        <span class="status-badge ${item.quantity <= item.minStock ? 'stock-low' : 'stock-good'}">
                            ${item.quantity} / ${item.minStock}
                        </span>
                    </td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${item.supplier}</td>
                    <td>${item.expiryDate}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editItem('${item.id}')">
                            ✏️
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')">
                            🗑️
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        function showAddItemModal() {
            const modal = document.getElementById('addItemModal');
            if (modal) {
                modal.classList.add('active');
            }
        }

        function showAddStaffModal() {
            const modal = document.getElementById('addStaffModal');
            if (modal) {
                modal.classList.add('active');
            }
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
            }
        }

        function handleAddItem(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const newItem = {
                id: Date.now().toString(),
                name: formData.get('itemName'),
                category: formData.get('itemCategory'),
                quantity: parseInt(formData.get('itemQuantity')),
                minStock: parseInt(formData.get('itemMinStock')),
                price: parseFloat(formData.get('itemPrice')),
                supplier: formData.get('itemSupplier'),
                expiryDate: formData.get('itemExpiry')
            };
            
            inventory.push(newItem);
            renderInventory();
            renderOverview();
            updateStats();
            closeModal('addItemModal');
            e.target.reset();
            
            showNotification('Producto agregado exitosamente', 'success');
        }

        function handleAddStaff(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const newStaff = {
                id: Date.now().toString(),
                name: formData.get('staffName'),
                role: formData.get('staffRole'),
                email: formData.get('staffEmail'),
                phone: formData.get('staffPhone'),
                status: formData.get('staffStatus')
            };
            
            staff.push(newStaff);
            renderStaff();
            renderOverview();
            updateStats();
            closeModal('addStaffModal');
            e.target.reset();
            
            showNotification('Personal agregado exitosamente', 'success');
        }

        function editItem(itemId) {
            const item = inventory.find(i => i.id === itemId);
            if (!item) return;
            
            alert(`Editar producto: ${item.name}\n\nFuncionalidad en desarrollo`);
        }

        function deleteItem(itemId) {
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                inventory = inventory.filter(i => i.id !== itemId);
                renderInventory();
                renderOverview();
                updateStats();
                showNotification('Producto eliminado', 'success');
            }
        }

        function editStaff(staffId) {
            const person = staff.find(s => s.id === staffId);
            if (!person) return;
            
            alert(`Editar personal: ${person.name}\n\nFuncionalidad en desarrollo`);
        }

        function deleteStaff(staffId) {
            if (confirm('¿Estás seguro de que quieres eliminar este miembro del personal?')) {
                staff = staff.filter(s => s.id !== staffId);
                renderStaff();
                renderOverview();
                updateStats();
                showNotification('Personal eliminado', 'success');
            }
        }

        function showNotification(message, type = 'success') {
            const container = document.getElementById('notificationContainer');
            if (!container) return;
            
            const notif = document.createElement('div');
            notif.className = `notification notification-${type}`;
            notif.textContent = message;
            
            container.appendChild(notif);
            
            setTimeout(() => {
                notif.style.opacity = 0;
                setTimeout(() => {
                    if (container.contains(notif)) {
                        container.removeChild(notif);
                    }
                }, 300);
            }, 3000);
        }

        // Cerrar modal al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
