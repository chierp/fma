'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [note, setNote] = useState('');
  const [fetchError, setFetchError] = useState('');

  const loadInventory = useCallback(async () => {
    setLoading(true);
    // Pull inventory joined with product + location info
    const { data, error } = await supabase
      .from('inventory')
      .select(
        `
        id,
        quantity,
        product_id,
        location_id,
        products ( sku, name, unit, selling_price, reorder_point ),
        locations ( name )
      `
      )
      .order('quantity', { ascending: true });

    if (error) {
      console.error('Inventory fetch error:', error);
      setFetchError(error.message);
      setRows([]);
    } else {
      setFetchError('');
      setRows(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
        return;
      }
      setUserId(session.user.id);
      loadInventory();
    });
  }, [router, loadInventory]);

  async function handleAdjust(row, delta) {
    setBusyId(row.id);

    const { error } = await supabase.rpc('adjust_inventory', {
      p_product_id: row.product_id,
      p_location_id: row.location_id,
      p_quantity_change: delta,
      p_note: note || (delta > 0 ? 'Manual stock in' : 'Manual stock out'),
      p_performed_by: userId,
    });

    setBusyId(null);

    if (error) {
      alert('Failed to update stock: ' + error.message);
      return;
    }

    loadInventory();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 22, margin: 0 }}>Warehouse Dashboard</h1>
        <button onClick={handleLogout} style={logoutBtn}>
          Log out
        </button>
      </div>

      <input
        type="text"
        placeholder="Note for next adjustment (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: 6,
          border: '1px solid #d1d5db',
          fontSize: 14,
          marginBottom: 16,
          boxSizing: 'border-box',
        }}
      />

      {fetchError && (
        <div
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          <strong>Error loading inventory:</strong> {fetchError}
        </div>
      )}

      {loading ? (
        <p>Loading stock...</p>
      ) : (
        <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                <th style={th}>SKU</th>
                <th style={th}>Product</th>
                <th style={th}>Location</th>
                <th style={th}>Stock</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const lowStock =
                  row.products?.reorder_point != null &&
                  row.quantity <= row.products.reorder_point;
                return (
                  <tr key={row.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                    <td style={td}>{row.products?.sku}</td>
                    <td style={td}>{row.products?.name}</td>
                    <td style={td}>{row.locations?.name}</td>
                    <td
                      style={{
                        ...td,
                        color: lowStock ? '#dc2626' : '#111827',
                        fontWeight: lowStock ? 700 : 400,
                      }}
                    >
                      {row.quantity} {row.products?.unit}
                      {lowStock && ' ⚠ low'}
                    </td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                      <button
                        disabled={busyId === row.id}
                        onClick={() => handleAdjust(row, 1)}
                        style={smallBtn}
                      >
                        + In
                      </button>
                      <button
                        disabled={busyId === row.id}
                        onClick={() => handleAdjust(row, -1)}
                        style={{ ...smallBtn, marginLeft: 6, background: '#fee2e2', color: '#991b1b' }}
                      >
                        − Out
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td style={td} colSpan={5}>
                    No inventory yet. Run seed.sql or add stock via Supabase.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = { padding: '10px 12px', fontWeight: 600, fontSize: 12, color: '#6b7280' };
const td = { padding: '10px 12px' };
const smallBtn = {
  padding: '4px 10px',
  fontSize: 12,
  borderRadius: 6,
  border: 'none',
  background: '#e0f2fe',
  color: '#075985',
  cursor: 'pointer',
};
const logoutBtn = {
  padding: '6px 14px',
  fontSize: 13,
  borderRadius: 6,
  border: '1px solid #d1d5db',
  background: 'white',
  cursor: 'pointer',
};
