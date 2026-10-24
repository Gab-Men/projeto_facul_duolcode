import { test } from "node:test";
import assert from "node:assert/strict";
import { PortfolioAnalysis } from "../src/domain/portfolio-analysis.js";

test("análise calcula média, mediana, desvio populacional e intervalos incluindo zero", () => {
  const report = new PortfolioAnalysis([0, 1, 2, 3, 4].map((projects, index) => ({
    clientId: index + 1, name: `Cliente ${index + 1}`, projects,
  }))).toReport();
  assert.equal(report.totalClients, 5);
  assert.equal(report.totalProjects, 10);
  assert.equal(report.activeClients, 4);
  assert.equal(report.inactiveClients, 1);
  assert.equal(report.mean, 2);
  assert.equal(report.median, 2);
  assert.ok(Math.abs(report.populationStdDev! - Math.sqrt(2)) < 1e-12);
  assert.equal(report.largestClientShare, 40);
  assert.deepEqual(report.histogram.map((bin) => bin.clients), [1, 1, 1, 1, 1]);
  assert.equal(report.clients[0].projects, 4);
});
test("análise distingue população vazia de clientes com zero projetos", () => {
  const empty = new PortfolioAnalysis([]).toReport();
  assert.equal(empty.mean, null);
  assert.equal(empty.median, null);
  assert.equal(empty.populationStdDev, null);
  assert.equal(empty.largestClientShare, null);
  assert.deepEqual(empty.histogram, []);
  const zero = new PortfolioAnalysis([{ clientId: 1, name: "Sem projetos", projects: 0 }]).toReport();
  assert.equal(zero.mean, 0);
  assert.equal(zero.median, 0);
  assert.equal(zero.populationStdDev, 0);
  assert.equal(zero.largestClientShare, null);
  assert.deepEqual(zero.histogram, [{ from: 0, to: 0, clients: 1 }]);
});
test("mediana par e histograma com contagens altas preservam todos os clientes", () => {
  const report = new PortfolioAnalysis([0, 1, 10, 101].map((projects, index) => ({
    clientId: index + 1, name: "Cliente", projects,
  }))).toReport();
  assert.equal(report.median, 5.5);
  assert.equal(report.histogram.length, 6);
  assert.equal(report.histogram.reduce((sum, bin) => sum + bin.clients, 0), 4);
  assert.ok(report.histogram.every((bin) => bin.to - bin.from + 1 === 17));
});
test("estado privado resiste a alterações na entrada e no relatório devolvido", () => {
  const input = [{ clientId: 1, name: " Cliente ", projects: 3 }];
  const analysis = new PortfolioAnalysis(input);
  input[0].projects = 999;
  input.push({ clientId: 2, name: "Outro", projects: 100 });
  const snapshot = analysis.toReport();
  snapshot.clients[0].projects = 888;
  snapshot.histogram[0].clients = 77;
  assert.equal(analysis.totalProjects, 3);
  assert.equal(analysis.toReport().clients[0].name, "Cliente");
  assert.equal(analysis.toReport().totalClients, 1);
  assert.equal(analysis.toReport().histogram[0].clients, 0);
  assert.deepEqual(Object.keys(analysis), []);
});
test("construtor rejeita contagens inválidas e clientes duplicados", () => {
  for (const projects of [-1, 0.5, Number.NaN, Infinity])
    assert.throws(() => new PortfolioAnalysis([{ clientId: 1, name: "Cliente", projects }]));
  assert.throws(() => new PortfolioAnalysis([{ clientId: 1, name: " ", projects: 0 }]));
  assert.throws(() => new PortfolioAnalysis([
    { clientId: 1, name: "Primeiro", projects: 1 },
    { clientId: 1, name: "Duplicado", projects: 1 },
  ]));
});
