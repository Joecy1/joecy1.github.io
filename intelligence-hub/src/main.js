import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.179.1/examples/jsm/controls/OrbitControls.js';

const COLORS = {
  policy: 0x8b5cf6, knowledge: 0x3b82f6, research: 0x06b6d4,
  philanthropy: 0x22c55e, network: 0x14b8a6, platform: 0xf97316,
  capital: 0xef4444, tech: 0xa855f7, industry: 0xf59e0b, person: 0x94a3b8
};

const wrap = document.querySelector('#canvas-wrap');
const details = document.querySelector('#details');
const search = document.querySelector('#search');
const kindFilter = document.querySelector('#kind-filter');
const reset = document.querySelector('#reset');
const legend = document.querySelector('#legend');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(0, 4, 20);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
wrap.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);
scene.add(new THREE.AmbientLight(0x9fb7d9, 2.2));
const key = new THREE.DirectionalLight(0xffffff, 2.5);
key.position.set(4, 8, 10);
scene.add(key);

const graphGroup = new THREE.Group();
scene.add(graphGroup);
const nodeMeshes = [];
const nodeById = new Map();
let allData;
let selectedId = null;

function resize() {
  const w = wrap.clientWidth;
  const h = wrap.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}
window.addEventListener('resize', resize);
resize();

function nodePosition(n) {
  const zByKind = { policy: 2.4, research: 1.2, knowledge: 1.5, network: 0.4, platform: -0.2, capital: -1.2, tech: -0.8, industry: -1.8, person: 0.2 };
  const spread = 13;
  return new THREE.Vector3((n.x - 0.5) * spread, (0.5 - n.y) * 8, zByKind[n.kind] ?? 0);
}

function buildLegend(nodes) {
  const kinds = [...new Set(nodes.map(n => n.kind))];
  legend.innerHTML = kinds.map(kind => `<span><i class="dot" style="background:#${COLORS[kind].toString(16).padStart(6, '0')}"></i>${kind}</span>`).join('');
  kindFilter.innerHTML = '<option value="all">All types</option>' + kinds.map(k => `<option value="${k}">${k}</option>`).join('');
}

function makeNode(n) {
  const geometry = new THREE.SphereGeometry(n.kind === 'person' ? 0.26 : 0.34, 20, 14);
  const material = new THREE.MeshStandardMaterial({ color: COLORS[n.kind] ?? 0xffffff, roughness: 0.55, metalness: 0.15, emissive: COLORS[n.kind] ?? 0xffffff, emissiveIntensity: 0.08 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(nodePosition(n));
  mesh.userData = n;
  graphGroup.add(mesh);
  nodeMeshes.push(mesh);
  nodeById.set(n.id, mesh);
  return mesh;
}

function makeEdge(e) {
  const a = nodeById.get(e.source);
  const b = nodeById.get(e.target);
  if (!a || !b) return;
  const geometry = new THREE.BufferGeometry().setFromPoints([a.position, b.position]);
  const color = e.confidence === 'low' ? 0x64748b : 0x9ec5e8;
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: e.confidence === 'low' ? 0.22 : 0.58 });
  const line = new THREE.Line(geometry, material);
  line.userData = e;
  graphGroup.add(line);
}

function connected(nodeId) {
  return allData.edges.filter(e => e.source === nodeId || e.target === nodeId);
}

function showDetails(n) {
  selectedId = n.id;
  const edges = connected(n.id);
  const byId = new Map(allData.nodes.map(x => [x.id, x]));
  const relationships = edges.map(e => {
    const other = byId.get(e.source === n.id ? e.target : e.source);
    return `<li><b>${e.type}</b> → ${other?.label?.replaceAll('\n', ' — ') ?? 'unknown'} <span class="badge">${e.confidence}</span><br><small>${e.note ?? ''}</small></li>`;
  }).join('');
  details.classList.remove('empty');
  details.innerHTML = `<h2>${n.label.replaceAll('\n', ' — ')}</h2><p><span class="badge">${n.kind}</span><span class="badge">score ${n.score}/20</span><span class="badge">${n.status}</span></p><h3>Role</h3><p>Public ecosystem node in the current physical-AI research scaffold. Score is a routing aid, not a ranking.</p><h3>Relationships (${edges.length})</h3><ul>${relationships || '<li>No relationships recorded.</li>'}</ul>`;
}

function applyFilters() {
  const q = search.value.trim().toLowerCase();
  const k = kindFilter.value;
  for (const mesh of nodeMeshes) {
    const n = mesh.userData;
    const match = (!q || n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q)) && (k === 'all' || n.kind === k);
    mesh.visible = match;
    mesh.material.opacity = match ? (selectedId === n.id ? 1 : 0.88) : 0.12;
    mesh.material.transparent = true;
    mesh.scale.setScalar(selectedId === n.id ? 1.5 : 1);
  }
}

function resetView() {
  search.value = '';
  kindFilter.value = 'all';
  selectedId = null;
  camera.position.set(0, 4, 20);
  controls.target.set(0, 0, 0);
  controls.update();
  details.className = 'details empty';
  details.innerHTML = '<h2>Select a node</h2><p>The detail panel will show the node’s role, score, confidence and connected organisations.</p>';
  applyFilters();
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
renderer.domElement.addEventListener('pointerup', event => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(nodeMeshes.filter(m => m.visible));
  if (hits.length) showDetails(hits[0].object.userData);
  applyFilters();
});
search.addEventListener('input', applyFilters);
kindFilter.addEventListener('change', applyFilters);
reset.addEventListener('click', resetView);

async function init() {
  allData = await fetch('./data/graph.json').then(r => { if (!r.ok) throw new Error(`graph.json ${r.status}`); return r.json(); });
  buildLegend(allData.nodes);
  allData.nodes.forEach(makeNode);
  allData.edges.forEach(makeEdge);
  document.querySelector('#loading')?.remove();
  applyFilters();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

init().catch(error => {
  document.querySelector('#loading').textContent = `Could not load graph: ${error.message}`;
});
animate();
