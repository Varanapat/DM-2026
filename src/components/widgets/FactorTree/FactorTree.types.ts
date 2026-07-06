export interface FactorTreeProps {
  rootValue: number;
  onSplit?: (nodeValue: number, factorA: number, factorB: number) => void;
}
