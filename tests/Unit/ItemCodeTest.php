<?php

namespace Tests\Unit;

use App\Support\ItemCode;
use PHPUnit\Framework\TestCase;

class ItemCodeTest extends TestCase
{
    public function test_reads_the_unit_suffix(): void
    {
        $this->assertSame('P', ItemCode::unitCode('ŠVIE102-P'));
        $this->assertSame('PK', ItemCode::unitCode('BIO001-PK'));
        $this->assertSame('Ž', ItemCode::unitCode('CHE010-Ž'));
        $this->assertNull(ItemCode::unitCode('ABC001'));
        $this->assertNull(ItemCode::unitCode(null));
    }

    public function test_replaces_or_appends_the_unit_suffix(): void
    {
        $this->assertSame('ŠVIE102-K', ItemCode::withUnit('ŠVIE102-P', 'K'));
        $this->assertSame('BIO001-V', ItemCode::withUnit('BIO001-PK', 'V'));
        $this->assertSame('ABC001-L', ItemCode::withUnit('ABC001', 'L'));
    }

    public function test_code_format(): void
    {
        foreach (['ŠVIE102-P', 'ŠVIE1000-K', 'BIO001-PK', 'ŽČĄ001-Ė'] as $valid) {
            $this->assertMatchesRegularExpression(ItemCode::PATTERN, $valid, $valid);
        }
        foreach (['ŠVIE10-K', 'švie102-p', 'BIO001-PKLX', 'BIO001', "BIO001-P\n"] as $invalid) {
            $this->assertDoesNotMatchRegularExpression(ItemCode::PATTERN, $invalid, json_encode($invalid));
        }
    }
}
