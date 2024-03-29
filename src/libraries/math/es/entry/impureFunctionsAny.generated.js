function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
import { config } from './configReadonly';
import { createNode, createArrayNode, createBlockNode, createConstantNode, createObjectNode, createParenthesisNode, createRelationalNode, createChainClass, createReviver, createConditionalNode, createOperatorNode, createRangeNode, createFunctionAssignmentNode, createChain, createAccessorNode, createAssignmentNode, createIndexNode, createSymbolNode, createFunctionNode, createParse, createEvaluate, createParserClass, createHelpClass, createSimplify, createRationalize, createHelp, createCompile, createParser, createDerivative, createApplyTransform, createFilterTransform, createMapTransform, createForEachTransform, createMaxTransform, createMinTransform, createSubsetTransform, createConcatTransform, createRangeTransform, createSumTransform, createIndexTransform, createColumnTransform, createRowTransform, createStdTransform, createMeanTransform, createVarianceTransform } from '../factoriesAny';
import { ResultSet, Complex, Range, eye, _false, _null, _true, BigNumber, Matrix, e, i, LN10, LOG10E, _NaN, pi, SQRT1_2 // eslint-disable-line camelcase
, tau, efimovFactor, fineStructure, sackurTetrode, weakMixingAngle, Fraction, LN2, phi, SQRT2, DenseMatrix, _Infinity, typed, isInteger, isNumeric, isPositive, isNaN, equalScalar, number, boolean as _boolean, complex, splitUnit, unaryPlus, apply, cube, expm1, log10, multiplyScalar, sign, square, bitNot, arg, im, not, filter, forEach, map, erf, format, isPrime, acos, acot, acsc, asec, asin, atan, atanh, cosh, coth, csch, sech, sinh, tanh, combinations, pickRandom, randomInt, LOG2E, clone, hasNumericValue, typeOf, string, fraction, unaryMinus, addScalar, exp, log2, sqrt, conj, getMatrixDataType, mode, print, acosh, acsch, asinh, cos, csc, sin, combinationsWithRep, random, version, isNegative, SparseMatrix, matrix, cbrt, gcd, mod, nthRoot, xgcd, bitAnd, bitXor, or, concat, diag, identity, ones, reshape, size, subset, zeros, to, round, leftShift, rightLogShift, compare, compareText, smaller, larger, unequal, max, ImmutableDenseMatrix, FibonacciHeap, sparse, acoth, atan2, sec, add, trace, composition, isZero, abs, floor, multiply, dotMultiply, re, flatten, resize, squeeze, prod, pow, dotPow, rightArithShift, compareNatural, equalText, largerEq, partitionSelect, min, Spa, asech, tan, setSize, norm, quantileSeq, gamma, bignumber, lcm, bitOr, kron, transpose, numeric, and, smallerEq, sort, cot, dot, sum, factorial, permutations, ceil, subtract, cross, ctranspose, equal, Index, setCartesian, setDistinct, setIsSubset, setPowerset, index, fix, range, divideScalar, nthRoots, lsolve, deepEqual, setDifference, setMultiplicity, hypot, lup, slu, det, distance, stirlingS2, catalan, xor, row, dotDivide, Unit, createUnit, setSymDifference, qr, inv, sqrtm, intersect, bellNumbers, atomicMass, bohrMagneton, boltzmann, conductanceQuantum, deuteronMass, electronMass, faraday, firstRadiation, gravitationConstant, hartreeEnergy, klitzing, magneticConstant, molarMass, molarPlanckConstant, neutronMass, planckCharge, planckLength, planckTemperature, protonMass, reducedPlanckConstant, secondRadiation, stefanBoltzmann, vacuumImpedance, column, usolve, setIntersect, lusolve, expm, avogadro, classicalElectronRadius, electricConstant, fermiCoupling, gravity, loschmidt, molarMassC12, nuclearMagneton, planckMass, quantumOfCirculation, speedOfLight, wienDisplacement, log, unit, divide, median, variance, std, multinomial, bohrRadius, elementaryCharge, inverseConductanceQuantum, molarVolume, planckTime, thomsonCrossSection, log1p, mean, gasConstant, planckConstant, setUnion, kldivergence, coulomb, rydberg, mad, magneticFluxQuantum } from './pureFunctionsAny.generated';
var math = {}; // NOT pure!

var mathWithTransform = {}; // NOT pure!

var classes = {}; // NOT pure!

export var Node = createNode({
  mathWithTransform: mathWithTransform
});
export var ArrayNode = createArrayNode({
  Node: Node
});
export var BlockNode = createBlockNode({
  Node: Node,
  ResultSet: ResultSet
});
export var ConstantNode = createConstantNode({
  Node: Node
});
export var ObjectNode = createObjectNode({
  Node: Node
});
export var ParenthesisNode = createParenthesisNode({
  Node: Node
});
export var RelationalNode = createRelationalNode({
  Node: Node
});
export var Chain = createChainClass({
  math: math
});
export var reviver = createReviver({
  classes: classes
});
export var ConditionalNode = createConditionalNode({
  Node: Node
});
export var OperatorNode = createOperatorNode({
  Node: Node
});
export var RangeNode = createRangeNode({
  Node: Node
});
export var FunctionAssignmentNode = createFunctionAssignmentNode({
  Node: Node,
  typed: typed
});
export var chain = createChain({
  Chain: Chain,
  typed: typed
});
export var AccessorNode = createAccessorNode({
  Node: Node,
  subset: subset
});
export var AssignmentNode = createAssignmentNode({
  matrix: matrix,
  Node: Node,
  subset: subset
});
export var IndexNode = createIndexNode({
  Index: Index,
  Node: Node,
  Range: Range,
  size: size
});
export var SymbolNode = createSymbolNode({
  Unit: Unit,
  Node: Node,
  math: math
});
export var FunctionNode = createFunctionNode({
  Node: Node,
  SymbolNode: SymbolNode,
  math: math
});
export var parse = createParse({
  AccessorNode: AccessorNode,
  ArrayNode: ArrayNode,
  AssignmentNode: AssignmentNode,
  BlockNode: BlockNode,
  ConditionalNode: ConditionalNode,
  ConstantNode: ConstantNode,
  FunctionAssignmentNode: FunctionAssignmentNode,
  FunctionNode: FunctionNode,
  IndexNode: IndexNode,
  ObjectNode: ObjectNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  RangeNode: RangeNode,
  RelationalNode: RelationalNode,
  SymbolNode: SymbolNode,
  config: config,
  numeric: numeric,
  typed: typed
});
export var evaluate = createEvaluate({
  parse: parse,
  typed: typed
});
export var Parser = createParserClass({
  parse: parse
});
export var Help = createHelpClass({
  parse: parse
});
export var simplify = createSimplify({
  bignumber: bignumber,
  fraction: fraction,
  ConstantNode: ConstantNode,
  FunctionNode: FunctionNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  SymbolNode: SymbolNode,
  add: add,
  config: config,
  divide: divide,
  equal: equal,
  isZero: isZero,
  mathWithTransform: mathWithTransform,
  multiply: multiply,
  parse: parse,
  pow: pow,
  subtract: subtract,
  typed: typed
});
export var rationalize = createRationalize({
  bignumber: bignumber,
  fraction: fraction,
  ConstantNode: ConstantNode,
  FunctionNode: FunctionNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  SymbolNode: SymbolNode,
  add: add,
  config: config,
  divide: divide,
  equal: equal,
  isZero: isZero,
  mathWithTransform: mathWithTransform,
  multiply: multiply,
  parse: parse,
  pow: pow,
  simplify: simplify,
  subtract: subtract,
  typed: typed
});
export var help = createHelp({
  Help: Help,
  mathWithTransform: mathWithTransform,
  typed: typed
});
export var compile = createCompile({
  parse: parse,
  typed: typed
});
export var parser = createParser({
  Parser: Parser,
  typed: typed
});
export var derivative = createDerivative({
  ConstantNode: ConstantNode,
  FunctionNode: FunctionNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  SymbolNode: SymbolNode,
  config: config,
  equal: equal,
  isZero: isZero,
  numeric: numeric,
  parse: parse,
  simplify: simplify,
  typed: typed
});

_extends(math, {
  'typeof': typeOf,
  eye: eye,
  reviver: reviver,
  "false": _false,
  "null": _null,
  "true": _true,
  e: e,
  i: i,
  LN10: LN10,
  LOG10E: LOG10E,
  NaN: _NaN,
  pi: pi,
  SQRT1_2: SQRT1_2,
  tau: tau,
  efimovFactor: efimovFactor,
  fineStructure: fineStructure,
  sackurTetrode: sackurTetrode,
  weakMixingAngle: weakMixingAngle,
  'E': e,
  LN2: LN2,
  phi: phi,
  SQRT2: SQRT2,
  Infinity: _Infinity,
  'PI': pi,
  typed: typed,
  isInteger: isInteger,
  isNumeric: isNumeric,
  isPositive: isPositive,
  isNaN: isNaN,
  equalScalar: equalScalar,
  number: number,
  "boolean": _boolean,
  complex: complex,
  splitUnit: splitUnit,
  unaryPlus: unaryPlus,
  apply: apply,
  cube: cube,
  expm1: expm1,
  log10: log10,
  multiplyScalar: multiplyScalar,
  sign: sign,
  square: square,
  bitNot: bitNot,
  arg: arg,
  im: im,
  not: not,
  filter: filter,
  forEach: forEach,
  map: map,
  erf: erf,
  format: format,
  isPrime: isPrime,
  acos: acos,
  acot: acot,
  acsc: acsc,
  asec: asec,
  asin: asin,
  atan: atan,
  atanh: atanh,
  cosh: cosh,
  coth: coth,
  csch: csch,
  sech: sech,
  sinh: sinh,
  tanh: tanh,
  chain: chain,
  combinations: combinations,
  pickRandom: pickRandom,
  randomInt: randomInt,
  LOG2E: LOG2E,
  clone: clone,
  hasNumericValue: hasNumericValue,
  typeOf: typeOf,
  string: string,
  fraction: fraction,
  unaryMinus: unaryMinus,
  addScalar: addScalar,
  exp: exp,
  log2: log2,
  sqrt: sqrt,
  conj: conj,
  getMatrixDataType: getMatrixDataType,
  mode: mode,
  print: print,
  acosh: acosh,
  acsch: acsch,
  asinh: asinh,
  cos: cos,
  csc: csc,
  sin: sin,
  combinationsWithRep: combinationsWithRep,
  random: random,
  version: version,
  isNegative: isNegative,
  matrix: matrix,
  cbrt: cbrt,
  gcd: gcd,
  mod: mod,
  nthRoot: nthRoot,
  xgcd: xgcd,
  bitAnd: bitAnd,
  bitXor: bitXor,
  or: or,
  concat: concat,
  diag: diag,
  identity: identity,
  ones: ones,
  reshape: reshape,
  size: size,
  subset: subset,
  zeros: zeros,
  to: to,
  round: round,
  leftShift: leftShift,
  rightLogShift: rightLogShift,
  compare: compare,
  compareText: compareText,
  smaller: smaller,
  larger: larger,
  unequal: unequal,
  max: max,
  sparse: sparse,
  acoth: acoth,
  atan2: atan2,
  sec: sec,
  add: add,
  trace: trace,
  composition: composition,
  isZero: isZero,
  abs: abs,
  floor: floor,
  multiply: multiply,
  dotMultiply: dotMultiply,
  re: re,
  flatten: flatten,
  resize: resize,
  squeeze: squeeze,
  prod: prod,
  pow: pow,
  dotPow: dotPow,
  rightArithShift: rightArithShift,
  compareNatural: compareNatural,
  equalText: equalText,
  largerEq: largerEq,
  partitionSelect: partitionSelect,
  min: min,
  asech: asech,
  tan: tan,
  setSize: setSize,
  norm: norm,
  quantileSeq: quantileSeq,
  gamma: gamma,
  bignumber: bignumber,
  lcm: lcm,
  bitOr: bitOr,
  kron: kron,
  transpose: transpose,
  numeric: numeric,
  and: and,
  smallerEq: smallerEq,
  sort: sort,
  cot: cot,
  dot: dot,
  sum: sum,
  factorial: factorial,
  permutations: permutations,
  ceil: ceil,
  subtract: subtract,
  cross: cross,
  ctranspose: ctranspose,
  equal: equal,
  setCartesian: setCartesian,
  setDistinct: setDistinct,
  setIsSubset: setIsSubset,
  setPowerset: setPowerset,
  index: index,
  fix: fix,
  range: range,
  divideScalar: divideScalar,
  nthRoots: nthRoots,
  lsolve: lsolve,
  deepEqual: deepEqual,
  setDifference: setDifference,
  setMultiplicity: setMultiplicity,
  hypot: hypot,
  lup: lup,
  slu: slu,
  det: det,
  distance: distance,
  stirlingS2: stirlingS2,
  catalan: catalan,
  xor: xor,
  row: row,
  dotDivide: dotDivide,
  createUnit: createUnit,
  setSymDifference: setSymDifference,
  qr: qr,
  inv: inv,
  sqrtm: sqrtm,
  intersect: intersect,
  bellNumbers: bellNumbers,
  atomicMass: atomicMass,
  bohrMagneton: bohrMagneton,
  boltzmann: boltzmann,
  conductanceQuantum: conductanceQuantum,
  deuteronMass: deuteronMass,
  electronMass: electronMass,
  faraday: faraday,
  firstRadiation: firstRadiation,
  gravitationConstant: gravitationConstant,
  hartreeEnergy: hartreeEnergy,
  klitzing: klitzing,
  magneticConstant: magneticConstant,
  molarMass: molarMass,
  molarPlanckConstant: molarPlanckConstant,
  neutronMass: neutronMass,
  planckCharge: planckCharge,
  planckLength: planckLength,
  planckTemperature: planckTemperature,
  protonMass: protonMass,
  reducedPlanckConstant: reducedPlanckConstant,
  secondRadiation: secondRadiation,
  stefanBoltzmann: stefanBoltzmann,
  vacuumImpedance: vacuumImpedance,
  column: column,
  usolve: usolve,
  setIntersect: setIntersect,
  lusolve: lusolve,
  expm: expm,
  avogadro: avogadro,
  classicalElectronRadius: classicalElectronRadius,
  electricConstant: electricConstant,
  fermiCoupling: fermiCoupling,
  gravity: gravity,
  loschmidt: loschmidt,
  molarMassC12: molarMassC12,
  nuclearMagneton: nuclearMagneton,
  planckMass: planckMass,
  quantumOfCirculation: quantumOfCirculation,
  speedOfLight: speedOfLight,
  wienDisplacement: wienDisplacement,
  log: log,
  unit: unit,
  divide: divide,
  median: median,
  variance: variance,
  std: std,
  multinomial: multinomial,
  bohrRadius: bohrRadius,
  elementaryCharge: elementaryCharge,
  inverseConductanceQuantum: inverseConductanceQuantum,
  molarVolume: molarVolume,
  planckTime: planckTime,
  thomsonCrossSection: thomsonCrossSection,
  log1p: log1p,
  parse: parse,
  evaluate: evaluate,
  mean: mean,
  'var': variance,
  simplify: simplify,
  rationalize: rationalize,
  gasConstant: gasConstant,
  planckConstant: planckConstant,
  setUnion: setUnion,
  'eval': evaluate,
  help: help,
  kldivergence: kldivergence,
  coulomb: coulomb,
  rydberg: rydberg,
  compile: compile,
  mad: mad,
  magneticFluxQuantum: magneticFluxQuantum,
  parser: parser,
  derivative: derivative,
  config: config
});

_extends(mathWithTransform, math, {
  apply: createApplyTransform({
    isInteger: isInteger,
    typed: typed
  }),
  filter: createFilterTransform({
    typed: typed
  }),
  map: createMapTransform({
    typed: typed
  }),
  forEach: createForEachTransform({
    typed: typed
  }),
  max: createMaxTransform({
    larger: larger,
    typed: typed
  }),
  min: createMinTransform({
    smaller: smaller,
    typed: typed
  }),
  subset: createSubsetTransform({
    matrix: matrix,
    typed: typed
  }),
  concat: createConcatTransform({
    isInteger: isInteger,
    matrix: matrix,
    typed: typed
  }),
  range: createRangeTransform({
    bignumber: bignumber,
    matrix: matrix,
    config: config,
    larger: larger,
    largerEq: largerEq,
    smaller: smaller,
    smallerEq: smallerEq,
    typed: typed
  }),
  sum: createSumTransform({
    bignumber: bignumber,
    fraction: fraction,
    add: add,
    config: config,
    typed: typed
  }),
  index: createIndexTransform({
    Index: Index
  }),
  column: createColumnTransform({
    Index: Index,
    matrix: matrix,
    range: range,
    typed: typed
  }),
  row: createRowTransform({
    Index: Index,
    matrix: matrix,
    range: range,
    typed: typed
  }),
  std: createStdTransform({
    sqrt: sqrt,
    typed: typed,
    variance: variance
  }),
  mean: createMeanTransform({
    add: add,
    divide: divide,
    typed: typed
  }),
  variance: createVarianceTransform({
    add: add,
    apply: apply,
    divide: divide,
    isNaN: isNaN,
    multiply: multiply,
    subtract: subtract,
    typed: typed
  })
});

_extends(classes, {
  ResultSet: ResultSet,
  Complex: Complex,
  Range: Range,
  Node: Node,
  ArrayNode: ArrayNode,
  BlockNode: BlockNode,
  ConstantNode: ConstantNode,
  ObjectNode: ObjectNode,
  ParenthesisNode: ParenthesisNode,
  RelationalNode: RelationalNode,
  Chain: Chain,
  BigNumber: BigNumber,
  Matrix: Matrix,
  ConditionalNode: ConditionalNode,
  OperatorNode: OperatorNode,
  Fraction: Fraction,
  RangeNode: RangeNode,
  DenseMatrix: DenseMatrix,
  FunctionAssignmentNode: FunctionAssignmentNode,
  SparseMatrix: SparseMatrix,
  ImmutableDenseMatrix: ImmutableDenseMatrix,
  FibonacciHeap: FibonacciHeap,
  AccessorNode: AccessorNode,
  Spa: Spa,
  AssignmentNode: AssignmentNode,
  Index: Index,
  Unit: Unit,
  IndexNode: IndexNode,
  SymbolNode: SymbolNode,
  FunctionNode: FunctionNode,
  Parser: Parser,
  Help: Help
});

Chain.createProxy(math);
export { embeddedDocs as docs } from '../expression/embeddedDocs/embeddedDocs';