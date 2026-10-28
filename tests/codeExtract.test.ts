import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  extractExample,
  parseSpec,
  usedImports,
} from '../app/client/codeExtract.js';

const demo = `import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Family } from './types.js';
function SliderDemo() {
  const [v, setV] = useState(1);
  return <Button onClick={() => setV(v + 1)}>{v}</Button>;
}
export const f = { demos: [
  {
    id: 'button',
    title: 'Button',
    render: () => (
      <div className="flex">
        <Button variant="outline">Un (texte)</Button>
      </div>
    ),
  },
  {
    id: 'slider',
    title: 'Slider',
    render: () => <SliderDemo />,
  },
]};`;

test('extractExample : JSX de render avec ses imports, sans les autres', () => {
  const code = extractExample(demo, 'button')!;
  assert.match(
    code,
    /^import \{ Button \} from '@\/components\/ui\/button';\n\n<div className="flex">/,
  );
  assert.doesNotMatch(code, /Badge/);
  assert.match(code, /<\/div>$/);
});

test('extractExample : une démo locale livre aussi sa fonction', () => {
  const code = extractExample(demo, 'slider')!;
  assert.match(code, /function SliderDemo\(\) \{/);
  assert.match(code, /<SliderDemo \/>$/);
  assert.equal(extractExample(demo, 'absent'), null);
});

test('usedImports ignore les modules relatifs et les noms inutilisés', () => {
  assert.equal(
    usedImports(demo, '<Badge />'),
    "import { Badge } from '@/components/ui/badge';",
  );
});

test('parseSpec : variantes, valeur par défaut, parts et dépendances', () => {
  const spec = parseSpec(`import { Button as P } from "@base-ui/react/button"
import { cva } from "class-variance-authority"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
const v = cva("a [&_svg:not([class*='size-'])]:size-4", {
  variants: {
    variant: { default: "x", "icon-xs": "y [&_[data-badge]]:z" },
    size: { sm: "h-7", lg: "h-9" },
  },
  defaultVariants: { variant: "default", size: "sm" },
})
export { Foo, Bar, v as fooVariants, fooVariants }`);
  assert.deepEqual(spec.variants, [
    { name: 'variant', options: ['default', 'icon-xs'], default: 'default' },
    { name: 'size', options: ['sm', 'lg'], default: 'sm' },
  ]);
  assert.deepEqual(spec.parts, ['Foo', 'Bar']);
  assert.equal(spec.primitive, 'button');
  assert.deepEqual(spec.packages, [
    '@base-ui/react',
    'class-variance-authority',
  ]);
  assert.deepEqual(spec.requires, ['button']);
});
