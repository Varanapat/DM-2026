import { isPrime, smallestFactor } from '@/utils/algorithms/factorization';

export interface TreeNode {
  value: number;
  children?: [TreeNode, TreeNode];
}

export interface PlacedNode {
  value: number;
  x: number;
  y: number;
  isPrime: boolean;
  /** split order (BFS) that revealed this node; root = -1 (always visible) */
  revealedBySplit: number;
  parent?: { x: number; y: number };
  /** BFS index of this node's own split, if it has children */
  splitIndex?: number;
}

/** Full factor tree: composites split into [firstFactor, cofactor] recursively. */
export function buildTree(n: number, firstPair?: [number, number]): TreeNode {
  if (isPrime(n) || n < 4) return { value: n };
  const [f, c] = firstPair && firstPair[0] * firstPair[1] === n ? firstPair : [smallestFactor(n), n / smallestFactor(n)];
  return { value: n, children: [buildTree(f), buildTree(c)] };
}

export function countSplits(node: TreeNode): number {
  if (!node.children) return 0;
  return 1 + countSplits(node.children[0]) + countSplits(node.children[1]);
}

/** Tidy layout + BFS split order, flattened for beat-driven rendering.
 * x in leaf-width units (0..width), y = depth. */
export function layoutTree(root: TreeNode): { nodes: PlacedNode[]; width: number; depth: number } {
  const nodes: PlacedNode[] = [];

  const measure = (node: TreeNode): number => (node.children ? measure(node.children[0]) + measure(node.children[1]) : 1);
  const width = measure(root);

  let splitCounter = 0;
  const queue: { node: TreeNode; x0: number; depth: number; revealedBySplit: number; parent?: { x: number; y: number } }[] = [
    { node: root, x0: 0, depth: 0, revealedBySplit: -1 },
  ];

  while (queue.length > 0) {
    const { node, x0, depth, revealedBySplit, parent } = queue.shift()!;
    const w = measure(node);
    const x = x0 + w / 2;
    const placed: PlacedNode = { value: node.value, x, y: depth, isPrime: !node.children, revealedBySplit, parent };
    if (node.children) {
      placed.splitIndex = splitCounter++;
      const leftW = measure(node.children[0]);
      queue.push({ node: node.children[0], x0, depth: depth + 1, revealedBySplit: placed.splitIndex, parent: { x, y: depth } });
      queue.push({
        node: node.children[1],
        x0: x0 + leftW,
        depth: depth + 1,
        revealedBySplit: placed.splitIndex,
        parent: { x, y: depth },
      });
    }
    nodes.push(placed);
  }

  const depth = Math.max(...nodes.map((n) => n.y));
  return { nodes, width, depth };
}

/** an alternative first split (≠ smallest-prime split) for the uniqueness demo, if one exists */
export function altFirstPair(n: number): [number, number] | null {
  const p = smallestFactor(n);
  const cof = n / p;
  if (isPrime(n) || cof === p) return null;
  // split as (cofactor, p)? same pair. Find a genuinely different divisor pair:
  for (let d = p + 1; d * d <= n; d++) {
    if (n % d === 0 && d !== p) return [d, n / d];
  }
  // fall back to swapping when cofactor is composite (e.g. 8 = 2×4 → alt 4×2 tree differs in shape)
  return !isPrime(cof) ? [cof, p] : null;
}
